import { ESO_Channel } from './ESO_enum';

// renommer ?
// name -> label
// ns -> channel
// events: derive / children

// type : 'action' sert à créer un canal dans solver.js

export interface Eventime {
	type?: string; // à retirer ?
	startAt: number;
	name?: string;
	channel?: ESO_Channel | string;
	data?: any;
	events?: Array<Eventime>;
}
export interface EmitEvent {
	name?: string;
	channel?: ESO_Channel;
	data?: any;
}
