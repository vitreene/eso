import {
	EsoActions,
	EsoEmit,
	EsoEvent,
	EsoInitial,
	Perso,
	Style,
} from '../../../types/initial';
import { setClassNames } from 'veso';

/* 
TODO chaine d'héritage
*/

export function deepmerge(_persos: Perso[]) {
	const persos = [];
	for (const _perso of _persos) {
	}

	return persos;
}

export const merge = {
	style(proto: Style, ref: Style) {
		const style = Object.assign({}, proto, ref);
		return Object.keys(style).length ? style : null;
	},
	className(proto: string | [string], ref: string | [string]) {
		const className = setClassNames(ref, proto).join(' ');
		return className ? className : null;
	},
	/* 
  les propriétés sont surchargées, 
  sauf className et style qui sont fusionnées
  */
	initial(proto: EsoInitial, ref: EsoInitial) {
		if (Object.keys(proto).length === 0) return ref;
		if (Object.keys(ref).length === 0) return proto;
		const className = this.className(proto.className, ref.className);
		const statStyle = this.style(proto.statStyle, ref.statStyle);
		const dynStyle = this.style(proto.dynStyle, ref.dynStyle);
		return Object.assign(
			{},
			proto,
			ref,
			className && { className },
			statStyle && { statStyle },
			dynStyle && { dynStyle }
		);
	},
	/* 
	ajouter les events, supprimer les doublons
	proto et ref ont des events uniques
	filtrer l'un des deux avec l'autre
	- comparer chaque item de l'un chez l'autre, abandonner dès qu'une diff est vue
	- signaler si un item est identique
  */
	listen(proto: EsoEvent[], ref: EsoEvent[]) {
		if (proto.length === 0) return ref;
		if (ref.length === 0) return proto;
		const _proto = proto.filter((event) => {
			let unique = true;
			for (const refEvent of ref) {
				for (const prop in event) {
					unique = true;
					if (refEvent[prop] !== event[prop]) break;
					unique = false;
				}
			}
			return unique;
		});
		return _proto.concat(ref);
	},
	/* 
  si deux actions ont le meme nom, elles sont fusionnées, 
  sinon elles s'ajoutent
  */
	actions(proto: EsoActions, ref: EsoActions) {
		if (proto.length === 0) return ref;
		if (ref.length === 0) return proto;
		const protoNames = new Map();
		proto.forEach((action) => protoNames.set(action.name, action));
		const refNames = new Map();
		ref.forEach((action) => refNames.set(action.name, action));

		for (const name of protoNames.keys()) {
			const action = refNames.has(name)
				? Object.assign({}, protoNames.get(name), refNames.get(name))
				: protoNames.get(name);
			refNames.set(name, action);
		}
		const actions = [];
		refNames.forEach((action) => actions.push(action));
		return actions;
	},
	/* 
   les propriétés sont surchargées
	*/
	emit(proto: EsoEmit, ref: EsoEmit) {
		return { ...proto, ...ref };
	},
	/* 
	merge persos
	*/
	persos(proto: Perso, ref: Perso) {
		if (Object.keys(proto).length === 0) return ref;
		if (Object.keys(ref).length === 0) return proto;
		const initial = this.initial(proto.initial, ref.initial);
		const actions = this.actions(proto.actions, ref.actions);
		const listen = this.listen(proto.listen, ref.listen);
		const emit = this.emit(proto.emit, ref.emit);
		return { ...ref, initial, listen, actions, emit };
	},

	extends(id: string, persos: Perso[]) {
		// if(!perso.extends) return perso
	},
};

/* export function deepmerge(proto: Perso, ref: Perso) {
	if (Object.keys(proto).length === 0) return ref;
	if (Object.keys(ref).length === 0) return proto;
	const initial = merge.initial(proto.initial, ref.initial);
	const actions = merge.actions(proto.actions, ref.actions);
	const listen = merge.listen(proto.listen, ref.listen);
	const emit = merge.emit(proto.emit, ref.emit);
	return { ...ref, initial, listen, actions, emit };
} */
