/* 
TODO
- when
*/
import { nanoid } from 'nanoid';

import { pipe } from '../shared/utils';

import {
	EsoAction,
	EsoActionEntry,
	EsoContent,
	EsoEvent,
	InputEsoEvents,
	Perso,
} from '../../../types/initial';

const PROTO = 'proto';
type Channel = string | null;
type PersoEntry = Perso & { actions: EsoActionEntry[] };

// pre : conformation
export function prePersos(persos: PersoEntry[]) {
	return pipe(natureSetProperty, idSetProperty, hasContentHTML)(persos);
}

export function natureSetProperty(_persos: Perso[]) {
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

export function idSetProperty(_persos: Perso[]) {
	const persos = [];
	for (const _perso of _persos) {
		const perso = { ..._perso, id: _perso.id || nanoid(8) };
		persos.push(perso);
	}
	return persos;
}

export function hasContentHTML(_persos: PersoEntry[]) {
	const persos = _persos.map((perso) => {
		const content = stringToHTML(perso.initial.content);
		console.log(perso.id, perso.actions);

		const actions = {};
		for (const key in perso.actions) {
			const content = stringToHTML(perso.actions[key].content);
			actions[key] = { ...perso.actions[key], ...(content && { content }) };
		}

		const initial = { ...perso.initial, ...(content && { content }) };
		return {
			...perso,
			initial,
			...(Object.keys(actions).length && { actions }),
		};
	});
	return persos;
}

// TODO fetch html file

// https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/15458987

function stringToHTML(str: EsoContent) {
	if (typeof str !== 'string') return str;
	const parser = new DOMParser();
	const doc = parser.parseFromString(str, 'text/html');
	const isHTML = Array.from(doc.body.childNodes).some(
		(node) => node.nodeType === 1
	);
	return isHTML ? doc.body.childNodes[0] : str;
}

export function filterProtos(_persos: Perso[]) {
	return _persos.filter((perso) => perso.nature !== PROTO);
}

export function dispatchPersoProps(channel: Channel) {
	return function (_persos: Perso[]) {
		const persos = _persos.map((_perso: Perso) => {
			const _actions = _perso.actions || [];
			const actions = objectKeyToArray(_actions, 'name' as keyof EsoAction);
			const _listen = _perso.listen || [];
			const listen = listenDisptachProps(channel, _listen, actions);
			return { ..._perso, actions, listen };
		});
		return persos;
	};
}

function listenDisptachProps(
	channel: Channel,
	_listen: InputEsoEvents,
	actions: EsoAction[]
) {
	const listen = pipe(
		listenExpandProps(channel),
		listenCollectAll(channel, actions)
	)(_listen);
	return listen;
}

export function listenCollectAll(channel: Channel, actions: EsoAction[]) {
	return function (_listen: EsoEvent[]) {
		const addNames: InputEsoEvents = [];
		const actionsName = new Set(actions.map((action) => action.name));
		const listenName = new Set(_listen.map((l) => l.action));
		actionsName.forEach((name: string) => {
			if (!listenName.has(name)) addNames.push(name);
		});
		const addListen = listenExpandProps(channel)(addNames);
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

// TODO channel prendra la ref de sa story par defaut
export function listenExpandProps(channel: Channel) {
	return function (_listen: InputEsoEvents) {
		// console.log('LISTEN', _listen);
		const listen = _listen.map((l) => {
			// ['ev1','ev2',...]
			if (typeof l === 'string')
				return { event: l, action: l, ...(channel && { channel }) };
			// [[ev011, play],...]
			if (Array.isArray(l))
				return { event: l[0], action: l[1], ...(channel && { channel }) };
			// [ {ev011: 'enter'},...]
			if (typeof l === 'object' && Object.keys(l).length === 1) {
				const [event, action] = Object.entries(l)[0];
				return { event, action, channel };
			}
			// [{ event: go, action: enter }]
			if (!l.channel) return { ...l, ...(channel && { channel }) };
			return l;
		});
		return listen;
	};
}

export function moveExpandProps(_actions: EsoAction[]) {
	if (!Array.isArray(_actions)) return _actions;
	const actions = _actions.map((action) => {
		if (typeof action.move === 'string')
			return { ...action, move: { slot: action.move } };
		return action;
	});
	return actions;
}

function objectKeyToArray<T>(obj: T, key: string) {
	if (typeof obj !== 'object') {
		console.warn("ce n'est pas un object : %s", obj);
		return [];
	}
	const arr = [];
	for (const o in obj) arr.push({ [key]: o, ...obj[o] });
	return arr;
}
