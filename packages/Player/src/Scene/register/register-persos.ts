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
	(Array.isArray(_persos) ? _persos : [_persos]).forEach((_perso: Perso) => {
		switch (_perso.nature) {
			case 'sound':
				break;
			case 'polygon':
				break;
			case 'button':
			case 'bloc':
				{
					const { messages } = options;
					const perso = preInitProps(_perso);
					persos.set(perso.id, createPerso.create(perso, { messages }));
				}
				break;
			case 'layer':
				{
					const { slot } = options;
					const perso = preInitProps(_perso);
					persos.set(perso.id, createPerso.create(perso, slot));
				}
				break;
			case 'img':
				{
					const { imagesCollection } = options;
					const perso = preInitProps(_perso);
					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			case 'sprite':
				{
					const { imagesCollection } = options;
					const initialDimensions = imagesCollection.get(
						_perso.initial.content as string
					);
					const additionnalStyles = {
						position: 'absolute' as Property.Position,
						initialDimensions,
					};
					const perso = preInitProps(_perso, additionnalStyles);

					// const imgDimensions = {
					// 	...initialDimensions,
					// 	...doDimensions(perso.initial.dimensions),
					// };

					// const classStyle = {
					// 	position: 'absolute' as Property.Position,
					// 	...perso.initial.classStyle,
					// 	...(imgDimensions && imgDimensions.classStyle),
					// };
					// perso.initial.classStyle = {
					// 	...perso.initial.classStyle,
					// 	...classStyle,
					// };

					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			default:
				break;
		}
	});
}

function preInitProps(_perso: Perso, additionnalStyles = {}) {
	const dimensions = doDimensions(_perso.initial.dimensions);
	const classStyle = {
		// position: 'absolute' as Property.Position,
		..._perso.initial.classStyle,
		...additionnalStyles,
		...(dimensions && dimensions.classStyle),
	};

	return {
		..._perso,
		initial: {
			..._perso.initial,
			classStyle: {
				..._perso.initial.classStyle,
				...classStyle,
			},
		},
	};
}
