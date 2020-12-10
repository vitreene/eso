import { Perso } from '../../../types/initial';
import { pipe } from '../shared/utils';
import { Stories } from './transforms';

export function transformPersos(s: Stories) {
	const _persos = s.persos;
	const persos = pipe(natureSetProperty, dispatchPersoProps)(_persos);
	// console.log('persos--->', persos);
	return { ...s, persos };
}

export function natureSetProperty(_persos: Stories['persos']) {
	const persos = [];
	for (const _perso of _persos) {
		// console.log(_perso);

		const nature = Object.keys(_perso).pop();
		const other = _perso[nature];
		// si nature est déclaré, il est prioritaire ?
		const perso: Perso = { nature, ...other };
		persos.push(perso);
	}
	// console.log('persos-->', persos);
	return persos;
}

export function dispatchPersoProps(_persos: Stories['persos']) {
	const _listen = _persos.listen;
	const listen = listenExpandProps(_listen);

	return { _persos, listen };
}

/* 
_listen peut avoir les formes : 
	- ['ev1','ev2',...]
	- [ev011: enter, ev012: step02, ...]
	- [{ event: go, action: enter }]
	- [ { ns: *TC, event: *PLAY, action: *PLAY }]
*/
export function listenExpandProps(_listen) {
	return _listen;
}
