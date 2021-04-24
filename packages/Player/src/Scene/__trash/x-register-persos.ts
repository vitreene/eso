import { doDimensions } from '../pre/dimensions';

import { Property } from 'csstype';
import { Slots } from '../store-slots';
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
	createPerso,
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
					const perso = preInit(_perso);
					persos.set(perso.id, createPerso.create(perso));
				}
				break;
			case 'list':
				const perso = preInit(_perso);
				persos.set(perso.id, createPerso.create(perso));
				break;
			case 'layer':
				{
					const perso = preInit(_perso);
					const { slot } = options;
					persos.set(perso.id, createPerso.create(perso, slot));
					// persos.set(perso.id, createPerso.create(perso));
				}
				break;
			case 'img':
				{
					const perso = preInit(_perso);
					persos.set(perso.id, createPerso.create(perso));
				}

				break;
			case 'sprite':
				{
					const { imagesCollection } = options;
					const perso = preInitSprite(_perso, imagesCollection);
					persos.set(perso.id, createPerso.create(perso, imagesCollection));
				}

				break;
			default:
				break;
		}
	});
}

function preInitSprite(_perso: Perso, imagesCollection: ImagesCollection) {
	const original = imagesCollection.get(_perso.initial.content as string);
	const { dimensions, classStyle, ...initial } = _perso.initial;
	const dims = doDimensions(dimensions, original);
	const _classStyle = {
		...classStyle,
		position: 'absolute' as Property.Position,
		...dims,
	};
	return { ..._perso, initial: { ...initial, classStyle: _classStyle } };
}

function preInit(_perso: Perso, additionnalStyles = {}) {
	const { dimensions, classStyle, ...initial } = _perso.initial;
	const dims = doDimensions(dimensions);
	const _classStyle = {
		...classStyle,
		...additionnalStyles,
		...dims,
	};
	return { ..._perso, initial: { ...initial, classStyle: _classStyle } };
}
