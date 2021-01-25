import { createPerso } from '../../composants';
import { ImagesCollection, Perso } from '../../../../types/initial';
import { ScenePersos } from '../../../../types/Entries-types';
import { Slots } from '../store-slots';

interface Options {
	imagesCollection?: ImagesCollection;
	slot?: Slots;
}

export function registerPersos(
	_persos: Perso[],
	persos: ScenePersos,
	options: Options
) {
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
					persos.set(perso.id, createPerso.create(perso, slot));
				}
				break;
			case 'button':
				persos.set(perso.id, createPerso.create(perso));
				break;
			case 'img':
			case 'sprite':
				{
					const { imagesCollection } = options;
					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			default:
				break;
		}
	});
}
