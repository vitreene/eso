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
faire une fonction récursive
faire référence à une copie de Persos qui sera modifié au fur et à mesure

Persos : passer en revue
- si le perso fait appel à un prototype (a)
	- atteindre le proto
	- ce proto a-t'il lui meme un proto -> (a)
	- ref = merge (proto, ref)
*/

export function deepmerge(_persos: Perso[]) {
	const persos = new Map(
		Array.from(_persos, (perso) => {
			return [perso.id, perso];
		})
	);

	for (let [id, _perso] of persos) recMerge(id, _perso);

	function recMerge(id: string, _perso: Perso) {
		if (!_perso.extends || !persos.has(_perso.extends)) return _perso;
		const _proto = recMerge(_perso.extends, persos.get(_perso.extends));
		if (_proto) {
			const { extends: string, ...others } = merge.persos(_proto, _perso);
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
		const statStyle = this.style(proto.statStyle, ref.statStyle);
		const dynStyle = this.style(proto.dynStyle, ref.dynStyle);
		const initial = Object.assign(
			{},
			proto,
			ref,
			className && { className },
			statStyle && { statStyle },
			dynStyle && { dynStyle }
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
		return {
			...ref,
			...(initial && { initial }),
			...(listen && { listen }),
			...(actions && { actions }),
			...(emit && { emit }),
		};
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
