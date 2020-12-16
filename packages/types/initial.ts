import * as CSS from 'csstype';
import { ESO_Namespace, ESO_Lang, Nature } from './ESO_Namespace';
import { Eventime } from './eventime';

export interface Style
	extends CSS.Properties<string | number>,
		CSS.PropertiesHyphen<string | number> {}

// en entrées YAML, resolues après
export type EsoEvents = Array<EsoEvent | EsoEventCondensed | string>;
export interface EsoEvent {
	event: string;
	action?: string;
	ns?: ESO_Namespace;
	data?: any;
}

export type EsoEventCondensed = [name: string, action: string]; // [event name, action]

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
	readonly nature: Nature;
	initial: EsoInitial;
	listen?: EsoEvent[];
	actions: EsoActions;
	emit?: EsoEmit;
	extends?: string;
}

export type EsoEmit = {
	readonly [key in keyof GlobalEventHandlersEventMap]?:
		| EsoEmitEvent
		| Array<EsoEmitEvent>;
};

interface EsoEmitEvent {
	event: Eventime;
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

export interface CollectionImages {
	width: number;
	height: number;
	ratio: number;
	src: string;
}
