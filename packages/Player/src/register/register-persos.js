import { persos } from '../data/store';
import { emitter } from '../data/emitter';

import initCreatePerso from './declare-persos';

export function registerPersos(stories) {
	const createPerso = initCreatePerso();
	(Array.isArray(stories) ? stories : [stories]).forEach((story) => {
		switch (story.nature) {
			case 'sound':
				break;
			case 'polygon':
				break;
			case 'layer':
			case 'bloc':
			case 'button':
			case 'img':
			case 'sprite':
				persos.set(story.id, createPerso.create(story, emitter));
				break;
			default:
				break;
		}
	});
}
