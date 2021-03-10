import { nanoid } from 'nanoid';

import { createPerso, commit } from './create-perso';
import { getElementOffset } from './shared/get-element-offset';
import { createRegisterKeyEvents } from './shared/register-keyEvents';
import { pipe, isVoid } from './shared/utils';

import { doDimensions } from './components/dimensions-component';
import { doStyle } from './components/style-component';
import { doClasses } from './components/classNames-component';
import { content } from './components/content-component';

import { createTransition } from './transitions';

const { css, ...style } = doStyle;

// TODO attr
export function createEso(emitter) {
	class Eso {
		static registerKeyEvents = createRegisterKeyEvents(emitter);
		static getElementOffset = getElementOffset;
		static transition = createTransition(emitter);
		id;
		uuid;
		tag;
		box;
		from;
		to;
		classStyle;
		revision;
		history = {}; // TODO faire une Map
		current = {}; // etat actuel avant prerender
		attributes = {}; // attributs du node
		propsInit = {};

		_node = null;
		set node(_n) {
			this._node = _n;
		}
		get node() {
			return this._node();
		}

		constructor(perso, init = true) {
			const { id, initial, tag, to } = perso;
			this.id = id;
			this.tag = tag;
			this.uuid = { uuid: nanoid(8), id };
			this.prep = { dimensions: doDimensions }; // a retirer
			this.to = to;
			this.revision = {
				className: doClasses,
				classStyle: style,
				between: style,
				content,
				style,
			};

			this._revise = this._revise.bind(this);
			this._pre = this._pre.bind(this);
			this.commit = commit.bind(this);

			// TODO ajouter des events liés à l'app (ex: langues)
			const events = Eso.registerKeyEvents(perso.emit);
			this.propsInit = { id, ...initial, ...events };
			init && this.init();
		}

		init() {
			this.propsInit && pipe(this._pre, this._revise)(this.propsInit);
			this.prerender();
			//  this.node call storeNodes
			this.node = createPerso.call(this);
		}

		update(props) {
			// const { between } = props;
			// this.id === 'text-sample' &&
			// 	between &&
			// 	console.log('between', this.id, between);
			// console.log('PROPS', props);
			// séparer : calculer les diffs, puis assembler
			// les diffs seront stockés pour la timeline (il faut le time)

			props && pipe(this._pre, this._revise)(props);

			this.prerender();
			this.commit(this.current);
		}

		//  TODO retirer cette fonction
		// dimensions sera traité au chargement des fichiers
		_pre(props) {
			const modiffs = [];
			for (const prep in this.prep) {
				if (props[prep]) {
					const modiff = this.prep[prep].update(
						props[prep],
						this.history[prep]
					);
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
						props.classStyle = { ...props.classStyle, pointerEvents: 'all' };
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
			this.from = {
				...this.from,
				...state.props.get('classStyle'),
				...state.props.get('style'),
				...state.props.get('between'),
			};

			// side effect : ajouter a l'historique
			this._addToHistory(state, props.chrono);
		}

		// TODO history doit accumuler les changements
		// pour le moment ne memorise que l'état courant
		_addToHistory({ props, attributes, events }, chrono) {
			props.forEach((diff, revise) => {
				switch (revise) {
					case 'style':
					case 'classStyle':
					case 'dimensions':
						this.history[revise] = { ...this.history[revise], ...diff };
						break;
					case 'between':
						this.history['style'] = { ...this.history['style'], ...diff };
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
				style: _style,
				classStyle: _classStyle,
				className,
				attributes,
				events,
				content: contentToRender,
				...other
			} = this.history;

			// this.from = {..._classStyle, _style}
			const content = this.revision.content.prerender
				? this.revision.content.prerender(contentToRender)
				: contentToRender;

			// const pointerEvents = options.pointerEvents ? "all" : "none";
			const style = this.revision.style.prerender(this.box, _style);

			if (_classStyle) {
				const classStyle = this.revision.style.prerender(this.box, _classStyle);
				this.classStyle = css(classStyle);
			}
			const _class = this.revision.className.prerender(
				this.classStyle,
				className
			);

			this.current = {
				style,
				class: _class,
				content,
				...Object.fromEntries(attributes || []),
				...Object.fromEntries(events || []),
				...other,
			};
			// console.log('this.current', this.current);
			box && this.commit(this.current);
		}
	}

	return Eso;
}
