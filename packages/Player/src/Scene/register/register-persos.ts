import { emitter } from '../../App/emitter';
import { createPerso } from '../../composants';

import { Perso } from '../../../../types/initial';

export function registerPersos(_persos: Perso[], persos, options) {
	(Array.isArray(_persos) ? _persos : [_persos]).forEach((perso) => {
		switch (perso.nature) {
			case 'sound':
				break;
			case 'polygon':
				break;
			case 'layer':
			case 'bloc':
				{
					const { slot } = options;
					persos.set(perso.id, createPerso.create(perso, emitter, slot));
				}
				break;
			case 'button':
				persos.set(perso.id, createPerso.create(perso, emitter));
				break;
			case 'img':
			case 'sprite':
				{
					const { imagesCollection } = options;
					persos.set(
						perso.id,
						createPerso.create(perso, emitter, imagesCollection)
					);
				}

				break;
			default:
				break;
		}
	});
}
