import {
	EsoActions,
	EsoEvent,
	EsoInitial,
	Style,
} from '../../../types/initial';
import { setClassNames } from 'veso';

/* 
TODO chaine d'héritage
*/
export function deepmerge(proto, ref) {
	const initial = merge.initial(proto.initial, ref.initial);
	return { ...ref, initial };
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
};
