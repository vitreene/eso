import * as CSS from 'csstype';

export interface Style
	extends CSS.Properties<string | number>,
		CSS.PropertiesHyphen<string | number> {}

export type EsoEvents = Array<EsoEvent | EsoEventCondensed | string>;
export interface EsoEvent {
	event: string;
	action?: string;
	ns?: ESO_Namespace;
	data?: any;
}
export interface EsoEventCondensed {
	[key: string]: string;
}

export interface EsoInitial {
	id?: string;
	className?: string | [string];
	statStyle?: Style;
	dynStyle?: Style;
	dimensions?: EsoDimensions;
	transition?: EsoTansition;
	content?: EsoContent;
	attr?: any;
	fit?: string;
}

export type EsoActions = Array<EsoAction>;
export interface EsoAction extends EsoInitial {
	name: string;
	move?: string | EsoMove;
	order?: number;
	exit?: boolean;
	leave?: boolean;
}

export interface Perso {
	readonly id: string;
	readonly nature: string;
	initial: EsoInitial;
	listen?: EsoEvents;
	actions: EsoActions;
	emit?: EsoEmit;
}

type EsoEmit = {
	readonly [key in keyof GlobalEventHandlersEventMap]?:
		| EsoEmitEvent
		| Array<EsoEmitEvent>;
};

interface EsoEmitEvent {
	event: { name?: string; ns?: ESO_Namespace };
	data?: any;
}

interface EsoMove {
	layer?: string;
	slot: string;
	rescale?: boolean;
}

interface EsoTansition {
	from?: string | Style;
	to: string | Style;
	duration?: number;
	oncomplete?: any;
}

interface EsoDimensions {
	width?: number | string;
	height?: number | string;
	ratio?: number;
}

interface EsoLang {
	lang?: ESO_Lang;
	refLang?: string;
	text?: string;
	ref?: string;
	effect?: string;
}

type EsoContent = string | Array<EsoInitial> | EsoLang;

// a recoller avec contantes.js
export enum ESO_Namespace {
	MAIN = 'anim',
	TELCO = 'telco',
	PLAY = 'play',
	PAUSE = 'pause',
	STOP = 'stop',
	REWIND = 'rewind',
	STRAP = 'strap',
	TEMPO = 'tempo',
	TOGGLE = 'toggle',
	DEFAULT_NS = MAIN,
	CONTAINER_ESO = 'main',
}

export enum ESO_Lang {
	'fr',
	'en',
	'de',
	'es',
	'nl',
	'it',
	'pl',
	'pt',
	'ru',
}
