import * as CSS from 'csstype';
import { ESO_Channel, ESO_Lang, Nature } from './ESO_enum';
import { EmitEvent, Eventime } from './eventime';

export interface Style
	extends CSS.Properties<string | number>,
		CSS.PropertiesHyphen<string | number> {}

// en entrées YAML, resolues après
export type InputEsoEvents = Array<string | EsoEventCondensed | EsoEvent>;
export interface EsoEvent {
	event: string;
	action: string;
	channel: ESO_Channel | string;
	data?: any;
}

export type EsoEventCondensed = [name: string, action: string]; // [event name, action]

export interface EsoInitial {
	id?: string;
	className?: string | [string];
	classStyle?: Style;
	style?: Style;
	dimensions?: EsoDimensions;
	content?: EsoContent;
	attr?: any;
	fit?: string;
}

export type EsoActionEntry = { [action: string]: EsoAction };
export interface EsoAction extends EsoInitial {
	name: string;
	transition?: EsoTansition;
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
	actions: EsoAction[];
	emit?: EsoEmit;
	extends?: string;
	src?: string;
}

export type EsoEmit = {
	readonly [key in keyof GlobalEventHandlersEventMap]?:
		| EsoEmitEvent
		| Array<EsoEmitEvent>;
};

interface EsoEmitEvent {
	event: EmitEvent;
	data?: any;
}

interface EsoMove {
	layer?: string;
	story?: string;
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

export type EsoContent =
	| string
	| Array<EsoInitial>
	| EsoLang
	| CollectionImages
	| HTMLElement;

export interface CollectionImages {
	width: number;
	height: number;
	ratio: number;
	src: string;
}

export type ImagesCollection = Map<string, CollectionImages>;
