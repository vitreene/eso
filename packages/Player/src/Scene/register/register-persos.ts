import { Slots } from '../store-slots';
import { createPerso } from '../../composants';

import { Message } from '../../../../types/message';
import { ScenePersos } from '../../../../types/Entries-types';
import { ImagesCollection, Perso } from '../../../../types/initial';

interface Options {
	imagesCollection?: ImagesCollection;
	slot?: Slots;
	messages?: Message;
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
			case 'button':
			case 'bloc':
				{
					const { messages } = options;
					persos.set(perso.id, createPerso.create(perso, { messages }));
				}
				break;
			case 'layer':
				{
					const { slot } = options;
					persos.set(perso.id, createPerso.create(perso, slot));
				}
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
