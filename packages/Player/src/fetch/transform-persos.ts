import { Perso } from '../../../types/initial';
import { pipe } from '../shared/utils';
import { Stories } from './transforms';

export function transformPersos(s: Stories) {
	const _persos = s.persos;
	const persos = pipe(natureSetProperty)(_persos);
	// console.log('persos--->', persos);
	return { ...s, persos };
}
function natureSetProperty(_persos: Stories['persos']) {
	const persos = [];
	for (const _perso of _persos) {
		console.log(_perso);

		const nature = Object.keys(_perso).pop();
		const other = _perso[nature];
		// si nature est déclaré, il est prioritaire ?
		const perso: Perso = { nature, ...other };
		persos.push(perso);
	}
	// console.log('persos-->', persos);
	return persos;
}
