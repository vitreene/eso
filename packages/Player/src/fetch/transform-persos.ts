/* 
TODO
- ajouter les actions non répertoriées à listen
- prototype / basedOn / extends

*/

import { Perso } from '../../../types/initial';
import { MAIN } from '../data/constantes';
import { pipe } from '../shared/utils';
import { Story, Perso as PersoInput } from './transforms';

export function transformPersos(s: Story) {
	const _persos = s.persos;
	const persos = pipe(natureSetProperty, dispatchPersoProps)(_persos);
	return { ...s, persos };
}

export function natureSetProperty(_persos: Story['persos']) {
	const persos = [];
	for (const _perso of _persos) {
		const nature = Object.keys(_perso).pop();
		const other = _perso[nature];
		// si nature est déclaré, il est prioritaire ?
		const perso: Perso = { nature, ...other };
		persos.push(perso);
	}
	return persos;
}

export function dispatchPersoProps(_persos: Story['persos']) {
	const persos = _persos.map((_perso: any) => {
		const _listen = _perso.listen;
		const listen = listenExpandProps(_listen);
		const _actions = _perso.actions;
		const actions = pipe(actionsToArray, moveExpandProps)(_actions);
		return { ..._perso, actions, listen };
	});
	return persos;
}

/* 
_listen peut avoir les formes : 
	- ['ev1','ev2',...]
	- [[ev011, play], [ev012, step02], ...]
	- [ {ev011: 'enter'},...]
	- [{ event: go, action: enter }]
	- [ { ns: *TC, event: *PLAY, action: *PLAY }]
	*/
export function listenExpandProps(_listen) {
	// TODO ns prendra la ref de sa story par defaut
	const ns = MAIN;
	// console.log('LISTEN', _listen);
	const listen = _listen.map((l) => {
		// ['ev1','ev2',...]
		if (typeof l === 'string') return { event: l, action: l, ns };
		// [[ev011, play],...]
		if (Array.isArray(l)) return { event: l[0], action: l[1], ns };
		// [ {ev011: 'enter'},...]
		if (typeof l === 'object' && Object.keys(l).length === 1) {
			const [event, action] = Object.entries(l)[0];
			return { event, action, ns };
		}
		// [{ event: go, action: enter }]
		if (!l.ns) return { ...l, ns };
		return l;
	});
	return listen;
}

export function actionsToArray(_actions: PersoInput['actions']) {
	const actions = objectKeyToArray(_actions, 'name');
	return actions;
}

export function moveExpandProps(_actions: PersoInput['actions']) {
	if (!Array.isArray(_actions)) return _actions;
	const actions = _actions.map((action) => {
		if (typeof action.move === 'string')
			return { ...action, move: { slot: action.move } };
		return action;
	});
	return actions;
}

function objectKeyToArray(obj: PersoInput['actions'], key: string) {
	if (typeof obj !== 'object') {
		console.warn("ce n'est pas un object : %s", obj);
		return obj;
	}
	const arr = [];
	for (const o in obj) arr.push({ [key]: o, ...obj[o] });
	return arr;
}
