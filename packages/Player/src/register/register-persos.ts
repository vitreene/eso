import { persos } from '../data/store-persos';
import { emitter } from '../data/emitter';

import initCreatePerso from './declare-persos';
import { Perso } from '../../../types/initial';

const createPerso = initCreatePerso();

export function registerPersos(_persos: Perso[]) {
	(Array.isArray(_persos) ? _persos : [_persos]).forEach((perso) => {
		switch (perso.nature) {
			case 'sound':
				break;
			case 'polygon':
				break;
			case 'layer':
			case 'bloc':
			case 'button':
			case 'img':
			case 'sprite':
				persos.set(perso.id, createPerso.create(perso, emitter));
				break;
			default:
				break;
		}
	});
}
