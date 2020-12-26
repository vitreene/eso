import { nanoid } from 'nanoid';

import { createPerso, commit } from './create-perso';
import { getElementOffset } from './shared/get-element-offset';
import { registerKeyEvents } from './shared/register-keyEvents';
import { pipe, isVoid } from './shared/utils';

import { doDimensions } from './components/dimensions-component';
import { transition } from './components/transitions-component';
import { doStyle } from './components/style-component';
import { doClasses } from './components/classNames-component';
import { content } from './components/content-component';

import { DEFAULT_NS, DEFAULT_TRANSITION_OUT } from './shared/constantes';

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
	propsInit = {};

	constructor(story, emitter, init = true) {
		const { id, initial, tag } = story;
		this.id = id;
		this.tag = tag;
		this.node;
		this.uuid = { uuid: nanoid(8), id };

		this._revise = this._revise.bind(this);
		this._pre = this._pre.bind(this);

		this.prep = {
			dimensions: doDimensions,
			transition: transition.call(this, emitter),
		};

		this.revision = {
			className: doClasses,
			statStyle: dynStyle,
			between: dynStyle,
			content,
			dynStyle,
		};

		this.commit = commit.bind(this);

		// TODO ajouter des events liés à l'app (ex: langues)
		const events = Eso.registerKeyEvents(story.emit, emitter);
		this.propsInit = { id, ...initial, ...events };
		init && this.init();
	}

	init() {
		this.propsInit && pipe(this._pre, this._revise)(this.propsInit);
		this.prerender();
		//  this.node() call storeNodes
		this.node = createPerso.call(this);
	}

	update(props) {
		// console.log("PROPS", props);
		// séparer : calculer les diffs, puis assembler
		// les diffs seront stockés pour la timeline (il faut le time)

		props &&
			pipe(
				props?.enter && this._onEnter,
				props?.exit && this._onLeave,
				this._pre,
				this._revise
			)(props);

		this.prerender();
		this.commit(this.current);
	}

	_onEnter(props) {
		return props;
	}
	_onLeave(props) {
		//ajouter ce  oncomplete dans la prop oncomplete de la dernière transition
		const oncomplete = {
			event: { channel: DEFAULT_NS, name: 'leave-' + props?.id },
			// pas de data si l'event est partagé par plusieurs elements
			// data: { leave: true }
		};
		const transition = props.transition?.length
			? props.transition
			: [{ to: DEFAULT_TRANSITION_OUT }];
		const lastTransition = transition.pop();
		console.log(
			'lastTransition , transition.',
			props,
			lastTransition,
			transition
		);
		lastTransition.oncomplete
			? lastTransition.oncomplete.push(oncomplete)
			: (lastTransition.oncomplete = [oncomplete]);
		transition.push(lastTransition);

		return { ...props, transition };
	}
	//  *  TODO conformer les autres evenements : transition, (et between ?)
	/**
	 * transforme les données qui ne sont pas directement des attributs :
	 *  dimensions, transitions, etc.
	 *  les éléments transformés doivent etre contenus dans la propriété cible :
	 *  ex : dimensions -> statStyle(width, height)
	 */
	_pre(props) {
		const modiffs = [];
		for (const prep in this.prep) {
			if (props[prep]) {
				const modiff = this.prep[prep].update(props[prep], this.history[prep]);
				modiffs.push(modiff);
			}
		}
		if (modiffs.length === 0) return props;

		// intégrer les nouvelles valeurs à l'existant
		// les valeurs de prop sont prioritaires
		const up = modiffs.reduce((acc, modiff) => {
			const curr = {};
			for (const [key, value] of Object.entries(modiff))
				curr[key] = { ...value, ...props[key] };
			return { ...acc, ...curr };
		}, props);

		return up;
	}

	// répartit les traitements par canal puis àjoute à l'historique
	_revise(props) {
		const revision = Object.keys(this.revision);

		const state = {
			props: new Map(),
			attributes: new Map(),
			events: new Map(),
		};

		for (const p in props) {
			switch (true) {
				// filtrer ce qui n'est pas dans revision
				case revision.includes(p):
					break;
				// si c'est un evenement
				case p[0] === 'o' && p[1] === 'n':
					state.events.set(p, props[p]);
					props.statStyle = { ...props.statStyle, pointerEvents: 'all' };
					break;
				// si c'est un attribut
				//FIXME evoluer vers data et aria
				case p === 'attr':
					for (const attr in props[p])
						state.attributes.set(attr, props[p][attr]);
					break;

				case p === 'id':
					state.attributes.set('id', props[p]);
					break;
			}
		}

		for (const revise in this.revision) {
			if (!isVoid(props[revise])) {
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
	// pour le moment ne memorise que l'état courant
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
				case 'className':
				case 'content':
					this.history[revise] = diff;
					break;
				default:
					break;
			}
		});
		this.history.attributes = attributes;
		this.history.events = events;
		// chrono && console.log(chrono, this.id, this.history);
	}

	// TODO  mise en cache des classes
	prerender(box) {
		// console.log('ESO box --> ', box);

		box && (this.box = box);

		// calculer styles : appliquer zoom sur unitless
		// ajouter box offset sur left et top ; et sur translate ?

		const {
			dynStyle,
			statStyle,
			className,
			attributes,
			events,
			content: contentToRender,
			...other
		} = this.history;

		const content = this.revision.content.prerender
			? this.revision.content.prerender(contentToRender)
			: contentToRender;

		// const pointerEvents = options.pointerEvents ? "all" : "none";
		const style = this.revision.dynStyle.prerender(this.box, dynStyle);

		if (statStyle) {
			const cssClass = this.revision.dynStyle.prerender(this.box, statStyle);
			this.cssClass = css(cssClass);
		}
		const theClasses = this.revision.className.prerender(
			this.cssClass,
			className
		);

		this.current = {
			style,
			class: theClasses,
			content,
			...Object.fromEntries(attributes || []),
			...Object.fromEntries(events || []),
			...other,
		};
		// console.log('this.current', this.current);
		box && this.commit(this.current);
	}
}
