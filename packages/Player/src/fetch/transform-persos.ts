/* 
TODO
- prototype / basedOn / extends
- when
*/
import { nanoid } from 'nanoid';

import { EsoActions, EsoEvent, EsoEvents, Perso } from '../../../types/initial';
import { MAIN } from '../data/constantes';
import { pipe } from '../shared/utils';
import { deepmerge } from './merge';
import { Story, PersoInput } from './transforms';

const PROTO = 'proto';

export function transformPersos(s: Story) {
	const _persos = s.persos;
	const persos = pipe(
		natureSetProperty,
		setId,
		dispatchPersoProps,
		deepmerge,
		filterProtos
	)(_persos);
	return { ...s, persos };
}

export function natureSetProperty(_persos: PersoInput[]) {
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

export function setId(_persos: PersoInput[]) {
	const persos = [];
	for (const _perso of _persos) {
		_perso.id = _perso.id || nanoid(8);
		persos.push(_perso);
	}
	return persos;
}

export function filterProtos(_persos: Perso[]) {
	return _persos.filter((perso) => perso.nature !== PROTO);
}

export function dispatchPersoProps(_persos: Perso[]) {
	const persos = _persos.map((_perso: any) => {
		const _actions = _perso.actions || [];
		const actions = pipe(actionsToArray, moveExpandProps)(_actions);
		const _listen = _perso.listen || [];
		const listen = listenDisptachProps(_listen, actions);
		return { ..._perso, actions, listen };
	});
	return persos;
}

function listenDisptachProps(_listen: EsoEvents, actions: EsoActions) {
	const listen = pipe(listenExpandProps, listenCollectAll(actions))(_listen);
	return listen;
}

export function listenCollectAll(actions: EsoActions) {
	return function (_listen: EsoEvent[]) {
		const addNames = [];
		const actionsName = new Set(actions.map((action) => action.name));
		const listenName = new Set(_listen.map((l) => l.action));
		actionsName.forEach((name) => {
			if (!listenName.has(name)) addNames.push(name);
		});
		const addListen = listenExpandProps(addNames);
		return _listen.concat(addListen);
	};
}

/* 
_listen peut avoir les formes : 
	- ['ev1','ev2',...]
	- [[ev011, play], [ev012, step02], ...]
	- [ {ev011: 'enter'},...]
	- [{ event: go, action: enter }]
	- [ { channel: *TC, event: *PLAY, action: *PLAY }]
	*/
export function listenExpandProps(_listen) {
	// TODO channel prendra la ref de sa story par defaut
	const channel = MAIN;
	// console.log('LISTEN', _listen);
	const listen = _listen.map((l) => {
		// ['ev1','ev2',...]
		if (typeof l === 'string') return { event: l, action: l, channel };
		// [[ev011, play],...]
		if (Array.isArray(l)) return { event: l[0], action: l[1], channel };
		// [ {ev011: 'enter'},...]
		if (typeof l === 'object' && Object.keys(l).length === 1) {
			const [event, action] = Object.entries(l)[0];
			return { event, action, channel };
		}
		// [{ event: go, action: enter }]
		if (!l.channel) return { ...l, channel };
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
