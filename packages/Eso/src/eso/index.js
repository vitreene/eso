import { nanoid } from 'nanoid';

import { createPerso } from '../register/create-perso';
import { getElementOffset } from './lib/get-element-offset';
import { registerKeyEvents } from './lib/register-keyEvents';
import { doDimensions } from './lib/dimensions-comp';
import { transition } from './transitions-comp';
import { doStyle } from './style-comp';
import { doClasses } from './classes-comp';
import { content } from './content-comp';
import { DEFAULT_NS, DEFAULT_TRANSITION_OUT } from '../data/constantes';
import { render } from './render';

const { css, ...dynStyle } = doStyle;
// TODO attr
export class Eso {
  static registerKeyEvents = registerKeyEvents;
  static getElementOffset = getElementOffset;

  id;
  zoom = 1;
  box = {};
  cssClass;
  revision;
  node;
  history = {}; // TODO faire une Map
  attributes = {};
  current = {}; // etat actuel avant prerender

  constructor(story, emitter) {
    const { id, initial, nature } = story;
    this.id = id;
    this.revision = {
      classes: doClasses,
      dimensions: doDimensions,
      statStyle: dynStyle,
      between: dynStyle,
      dynStyle,
      content,
      // FIXME retirer les transitions pour commencer
      // transition: transition.call(this, emitter),
    };
    this.uuid = { uuid: nanoid(6), nature };

    this.render = render.bind(this);
    // this.update(initial);
    this.init(initial);
  }

  init(props) {
    this._revise(props);
    this.prerender();
    const { node, attributes } = createPerso(this.uuid, this.current);
    this.node = node;
    this.attributes = attributes;
    console.log('attributes', attributes);
  }
  update(props) {
    console.log('PROPS', props);
    // séparer : calculer les diffs, puis assembler
    // les diffs seront stockés pour la timeline (il faut le time)
    let up = props;
    props?.enter && (up = this._onEnter(props));
    props?.exit && (up = this._onLeave(props));

    this._revise(up);
    this.prerender();
    this.render(this.current);
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

    const up = {
      ...props,
      transition,
    };
    return up;
  }

  _revise(props) {
    if (!props) return;
    // TODO separer les attributs, les events

    const revision = Object.keys(this.revision);
    const state = {
      attributes: new Map(),
      events: new Map(),
    };

    for (const prop in props) {
      if (revision.includes(prop)) continue;
      else if (prop[0] === 'o' && prop[1] === 'n')
        state.events.set(props[prop]);
      else state.attributes.set(props[prop]);
    }

    const newState = new Map();
    for (const revise in this.revision) {
      if (props[revise]) {
        const diff = this.revision[revise].update(
          props[revise],
          this.history[revise]
        );
        newState.set(revise, diff);
      }
    }
    // TODO renvoyer attributs et events sur le node
    state.props = newState;
    this._addToHistory(newState, props.chrono);
  }

  _addToHistory(state, chrono) {
    state.forEach((diff, revise) => {
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
          // console.log(this.id, revise, diff);
          this.history[revise] = diff;
          break;
        case 'transition':
          // où et pour qui cette info sera utile ? pour timeline ?
          break;

        default:
          break;
      }
    });
    chrono && console.log(chrono, this.id, this.history);
  }

  // TODO  mise en cache des classes
  prerender(box) {
    // console.log('ESO box --> ', box);

    box && (this.box = box);

    // calculer styles : appliquer zoom sur unitless
    // ajouter box offset sur left et top ; et sur translate ?
    // transformer style statique  + dimensions + pointerevent en classe

    const { dynStyle, statStyle, dimensions, classes, ...other } = this.history;
    // const pointerEvents = options.pointerEvents ? "all" : "none";
    const style = this.revision.dynStyle.prerender(this.box, dynStyle);
    // console.log(style, dynStyle);

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
      ...other,
    };
    box && this.render(this.current);
  }
}
