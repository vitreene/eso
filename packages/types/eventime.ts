import { ESO_Namespace } from './ESO_Namespace';

export interface Eventimes {
	name: string;
	start: number;
	events: Array<Eventime>;
}

export interface Eventime {
	start?: number;
	name?: string;
	ns?: ESO_Namespace;
	data?: any;
}
