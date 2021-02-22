import {
	EsoActions,
	EsoEmit,
	EsoEvent,
	EsoInitial,
	Perso,
	Style,
} from '../../../types/initial';
import { setClassNames } from 'veso';

/**
 *
 * @param _persos liste de persos sur lesquels appliquer les héritages
 * @param _shared reserve de persos partagés dont les héritages sont résolus
 */
export function mergePersos(_persos: Perso[], _shared: Perso[] = []) {
	console.log(_persos, _shared);

	const persos = new Map(Array.from(_persos, (perso) => [perso.id, perso]));
	const protos = new Map(Array.from(_shared, (proto) => [proto.id, proto]));

	for (const [id, _perso] of persos) recMerge(id, _perso);

	function recMerge(id: string, _perso: Perso) {
		const perso = persos.get(_perso.extends) || protos.get(_perso.extends);
		if (!perso) return _perso;
		const _proto = recMerge(_perso.extends, perso);
		if (_proto) {
			const { extends: _, ...others } = merge.persos(_proto, _perso);
			persos.set(id, others);
		}
		return _perso;
	}

	return Array.from(persos.values());
}

type ClassName = undefined | string | [string] | [];

export const merge = {
	style(proto: Style, ref: Style) {
		const style = Object.assign({}, proto, ref);
		return Object.keys(style).length ? style : null;
	},
	className(proto: ClassName, ref: ClassName) {
		const className = setClassNames(ref, proto).join(' ');
		return className ? className : null;
	},
	/* 
  les propriétés sont surchargées, 
  sauf className et style qui sont fusionnées
  */
	initial(proto: EsoInitial, ref: EsoInitial) {
		if (!proto || Object.keys(proto).length === 0) return ref;
		if (!ref || Object.keys(ref).length === 0) return proto;
		const className = this.className(proto.className, ref.className);
		const classStyle = this.style(proto.classStyle, ref.classStyle);
		const style = this.style(proto.style, ref.style);
		const initial = Object.assign(
			{},
			proto,
			ref,
			className && { className },
			classStyle && { classStyle },
			style && { style }
		);
		return Object.keys(initial).length === 0 ? null : initial;
	},
	/* 
	ajouter les events, supprimer les doublons
	proto et ref ont des events uniques
	filtrer l'un des deux avec l'autre
	- comparer chaque item de l'un chez l'autre, abandonner dès qu'une diff est vue
	- signaler si un item est identique
  */
	listen(proto: EsoEvent[], ref: EsoEvent[]) {
		if (!proto || proto.length === 0) return ref;
		if (!ref || ref.length === 0) return proto;
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
		const listen = _proto.concat(ref);
		return listen.length === 0 ? null : listen;
	},
	/* 
  si deux actions ont le meme nom, elles sont fusionnées, 
  sinon elles s'ajoutent
  */
	actions(proto: EsoActions, ref: EsoActions) {
		if (!proto || proto.length === 0) return ref;
		if (!ref || ref.length === 0) return proto;
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
		return actions.length === 0 ? null : actions;
	},
	/* 
   les propriétés sont surchargées
	*/
	emit(proto: EsoEmit, ref: EsoEmit) {
		const emit = { ...proto, ...ref };
		return Object.keys(emit).length === 0 ? null : emit;
	},
	/* 
	merge persos
	*/
	persos(proto: Perso, ref: Perso) {
		if (!proto || Object.keys(proto).length === 0) return ref;
		if (!ref || Object.keys(ref).length === 0) return proto;
		const initial = this.initial(proto.initial, ref.initial);
		const actions = this.actions(proto.actions, ref.actions);
		const listen = this.listen(proto.listen, ref.listen);
		const emit = this.emit(proto.emit, ref.emit);
		return Object.assign({}, { ...ref }, initial, listen, actions, emit);
		// return {
		// 	...ref,
		// 	...(initial && { initial }),
		// 	...(listen && { listen }),
		// 	...(actions && { actions }),
		// 	...(emit && { emit }),
		// };
	},
};
