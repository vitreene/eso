import { nanoid } from 'nanoid';

import { createPerso, commit } from './create-perso';
import { getElementOffset } from './lib/get-element-offset';
import { registerKeyEvents } from './lib/register-keyEvents';
import { doDimensions } from './lib/dimensions-comp';
import { transition } from './transitions-comp';
import { doStyle } from './style-comp';
import { doClasses } from './classes-comp';
import { content } from './content-comp';
import { DEFAULT_NS, DEFAULT_TRANSITION_OUT } from '../data/constantes';

const { css, ...dynStyle } = doStyle;
// TODO attr
export class Eso {
  static registerKeyEvents = registerKeyEvents;
  static getElementOffset = getElementOffset;

  id;
  uuid;
  tag;
  zoom = 1;
  box;
  cssClass;
  revision;
  history = {}; // TODO faire une Map
  current = {}; // etat actuel avant prerender
  attributes = {}; // attributs du node

  constructor(story, emitter) {
    const { id, initial, tag } = story;
    this.id = id;
    this.tag = tag;
    this.node;
    this.uuid = { uuid: nanoid(8), id };

    this.revision = {
      classes: doClasses,
      dimensions: doDimensions,
      statStyle: dynStyle,
      between: dynStyle,
      dynStyle,
      content,
      transition: transition.call(this, emitter),
    };

    this.commit = commit.bind(this);

    const events = Eso.registerKeyEvents(story.emit, emitter);
    this.init(initial, events);
  }

  init(initial, events) {
    const props = { ...initial, ...events };
    this._revise(props);
    this.prerender();
    this.node = createPerso.call(this);
  }

  update(props) {
    // console.log("PROPS", props);
    // séparer : calculer les diffs, puis assembler
    // les diffs seront stockés pour la timeline (il faut le time)
    let up = props;
    props?.enter && (up = this._onEnter(props));
    props?.exit && (up = this._onLeave(props));

    this._revise(up);
    this.prerender();
    this.commit(this.current);
  }
  _onEnter(props) {
    return props;
  }
  _onLeave(props) {
    //ajouter ce  oncomplete dans la prop oncomplete de la dernière transition
    const oncomplete = {
      event: { ns: DEFAULT_NS, name: 'leave-' + props?.id },
      // pas de data si l'event est partag' par plusieurs elements
      // data: { leave: true }
    };
    const transition = props.transition || [{ to: DEFAULT_TRANSITION_OUT }];
    const lastTransition = transition.pop();
    lastTransition.oncomplete
      ? lastTransition.oncomplete.push(oncomplete)
      : (lastTransition.oncomplete = [oncomplete]);
    transition.push(lastTransition);

    return { ...props, transition };
  }

  _revise(props) {
    if (!props) return;
    const revision = Object.keys(this.revision);

    const state = {
      props: new Map(),
      attributes: new Map(),
      events: new Map(),
    };

    for (const p in props) {
      if (revision.includes(p)) continue;
      else if (p[0] === 'o' && p[1] === 'n') state.events.set(p, props[p]);
      else state.attributes.set(p, props[p]);
    }

    for (const revise in this.revision) {
      if (props[revise]) {
        const diff = this.revision[revise].update(
          props[revise],
          this.history[revise]
        );
        state.props.set(revise, diff);
      }
    }

    // side effect : ajouter a l'historique
    this._addToHistory(state, props.chrono);
  }

  // TODO history doit accumuler les changements
  _addToHistory({ props, attributes, events }, chrono) {
    props.forEach((diff, revise) => {
      switch (revise) {
        case 'dynStyle':
        case 'statStyle':
        case 'dimensions':
          this.history[revise] = { ...this.history[revise], ...diff };
          break;
        case 'between':
          this.history['dynStyle'] = { ...this.history['dynStyle'], ...diff };
          break;
        case 'classes':
        case 'content':
          this.history[revise] = diff;
          break;
        case 'transition':
          // où et pour qui cette info sera utile ? pour timeline ?
          break;

        default:
          break;
      }
    });
    this.history.attributes = attributes;
    this.history.events = events;
    chrono && console.log(chrono, this.id, this.history);
  }

  // TODO  mise en cache des classes
  prerender(box) {
    // console.log('ESO box --> ', box);

    box && (this.box = box);

    // calculer styles : appliquer zoom sur unitless
    // ajouter box offset sur left et top ; et sur translate ?
    // transformer style statique  + dimensions + pointerevent en classe

    const {
      dynStyle,
      statStyle,
      dimensions,
      classes,
      attributes,
      events,
      ...other
    } = this.history;
    // const pointerEvents = options.pointerEvents ? "all" : "none";
    const style = this.revision.dynStyle.prerender(this.box, dynStyle);

    if (statStyle || dimensions) {
      const cssClass = this.revision.dynStyle.prerender(this.box, {
        ...statStyle,
        ...dimensions,
        //   ,pointerEvents
      });
      // console.log(this.id, this.box, dimensions, cssClass);

      this.cssClass = css(cssClass);
    }

    const theClasses = this.revision.classes.prerender(this.cssClass, classes);

    this.current = {
      style,
      class: theClasses,
      ...Object.fromEntries(attributes || []),
      ...Object.fromEntries(events || []),
      ...other,
    };
    // console.log('this.current', this.current);
    box && this.commit(this.current);
  }
}
