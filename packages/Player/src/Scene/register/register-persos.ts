import { Slots } from '../store-slots';
import { createPerso } from '../../composants';
import { doDimensions } from '../pre/dimensions';

import { Message } from '../../../../types/message';
import { ScenePersos } from '../../../../types/Entries-types';
import { ImagesCollection, Perso } from '../../../../types/initial';
import { Property } from 'csstype';

interface Options {
	imagesCollection?: ImagesCollection;
	slot?: Slots;
	messages?: Message;
}

//TODO dimensions dans intiial pour n'importe quel composant
// TODO dans une fonction à part

export function registerPersos(
	_persos: Perso[],
	persos: ScenePersos,
	options: Options
) {
	(Array.isArray(_persos) ? _persos : [_persos]).forEach((perso: Perso) => {
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
				{
					const { imagesCollection } = options;
					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			case 'sprite':
				{
					const { imagesCollection } = options;
					const initialDimensions = imagesCollection.get(
						perso.initial.content as string
					);
					const dimensions = {
						...initialDimensions,
						...doDimensions(perso.initial.dimensions),
					};

					const classStyle = {
						position: 'absolute' as Property.Position,
						...perso.initial.classStyle,
						...(dimensions && dimensions.classStyle),
					};
					perso.initial.classStyle = {
						...perso.initial.classStyle,
						...classStyle,
					};

					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			default:
				break;
		}
	});
}
