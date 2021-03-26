import { Slots } from '../store-slots';
import { createPerso } from '../../composants';
import { doDimensions } from '../pre/dimensions';

import { Message } from '../../../../types/message';
import { ScenePersos } from '../../../../types/Entries-types';
import { ImagesCollection, Perso, Style } from '../../../../types/initial';
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
					const perso = preInit(_perso);
					persos.set(perso.id, createPerso.create(perso, { messages }));
				}
				break;
			case 'layer':
				{
					const { slot } = options;
					const perso = preInit(_perso);
					persos.set(perso.id, createPerso.create(perso, slot));
				}
				break;
			case 'img':
				{
					const { imagesCollection } = options;
					const perso = preInit(_perso);
					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			case 'sprite':
				{
					const { imagesCollection } = options;
					const perso = preInitSprite(_perso, imagesCollection);
					console.log('SPRITE', perso.initial);

					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			default:
				break;
		}
	});
}
/* 
ereur de conception
dans Sprite, la taile originale est récupérée dans l'image;
une autre taille est proposée dans initial ; cette taille sert de mise à l'échelle 
*/
function preInitSprite(_perso: Perso, imagesCollection) {
	const original = imagesCollection.get(_perso.initial.content as string);
	const { dimensions, classStyle, ...initial } = _perso.initial;

	const dims = doDimensions(dimensions, original);

	const style = {
		position: 'absolute' as Property.Position,
		...(dims && dims.classStyle),
	};
	const _classStyle = {
		...classStyle,
		...(dims && dims.classStyle),
	};
	console.log({ initial, _classStyle });

	return { ..._perso, initial: { ...initial, classStyle: _classStyle } };
}

function preInit(_perso: Perso, additionnalStyles = {}) {
	const { dimensions, classStyle, ...initial } = _perso.initial;
	const dims = doDimensions(dimensions);

	const _classStyle = {
		...classStyle,
		...additionnalStyles,
		...(dims && dims.classStyle),
	};
	console.log({ initial, additionnalStyles, _classStyle });

	return { ..._perso, initial: { ...initial, classStyle: _classStyle } };
}
