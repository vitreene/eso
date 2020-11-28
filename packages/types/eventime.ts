import { ESO_Namespace } from './ESO_Namespace';

export interface Eventime {
	type?: string;
	start?: number;
	name?: string;
	ns?: ESO_Namespace;
	data?: any;
	events?: Array<Eventime>;
}
