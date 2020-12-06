import { ESO_Namespace } from './ESO_Namespace';

// renommer ?
// name -> label
// ns -> channel
// events: derive / children

// type : 'action' sert à créer un canal dans solver.js

export interface Eventime {
	type?: string; // à retirer ?
	startAt: number;
	name?: string;
	ns?: ESO_Namespace;
	data?: any;
	events?: Array<Eventime>;
}
