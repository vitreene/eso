import { doDimensions } from '../shared/dimensions';
import { pipe } from '../shared/utils';

import { DEFAULT_STYLES, MISSING } from '../shared/constantes';

import { Message } from '../../../types/message';
import { Slots } from '../../../Player/src/Scene/store-slots';
import { Eso, ScenePersos } from '../../../types/Entries-types';
import { ImagesCollection, Perso } from '../../../types/initial';

interface ContentTypes {
	slot?: Slots;
	text?: Message;
	image?: ImagesCollection;
}

interface CreatePerso {
	create: (p: Perso, o?: ImagesCollection | Slots | Message) => Eso;
}

export function registerPersos(
	createPerso: CreatePerso,
	contentTypes: ContentTypes
) {
	return function register(_persos: Perso[]): ScenePersos {
		const persos = prep(_persos, contentTypes);
		const scenePersos: ScenePersos = new Map();

		(Array.isArray(persos) ? persos : [persos]).forEach((perso: Perso) => {
			switch (perso.nature) {
				case 'sound':
					console.log('SOUND', perso);

					break;
				case 'polygon':
					break;
				case 'button':
				case 'bloc':
				case 'list':
				case 'img':
				case 'sprite':
				case 'layer':
					scenePersos.set(perso.id, createPerso.create(perso));
					break;
				default:
					break;
			}
		});
		return scenePersos;
	};
}

function prep(persos, contentTypes) {
	return persos.map(
		pipe(resolveInitialProperties(contentTypes), prepareTransitions)
	);
}

function resolveInitialProperties(contentTypes: ContentTypes) {
	return function pre(perso: Perso) {
		switch (perso.nature) {
			case 'sprite':
				const imagesCollection = contentTypes.image;
				return preInitSprite(perso, imagesCollection);
			default:
				return preInit(perso);
		}
	};
}

function preInitSprite(perso: Perso, imagesCollection: ImagesCollection) {
	console.log(perso, imagesCollection);

	const original = imagesCollection.get(perso.initial.content as string);
	const { dimensions, classStyle, ...initial } = perso.initial;
	const dims = doDimensions(dimensions, original);
	const _classStyle = {
		...classStyle,
		position: 'absolute',
		...dims,
	};
	return { ...perso, initial: { ...initial, classStyle: _classStyle } };
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

export function prepareTransitions(perso: Perso) {
	const { initial, actions } = perso;
	if (!actions) return perso;
	const styleProps = initial
		? {
				...DEFAULT_STYLES,
				...initial.classStyle,
				...initial.dimensions,
				...initial.style,
		  }
		: DEFAULT_STYLES;

	const toStyles = actions
		.map((action) => action.transition?.to)
		.filter(Boolean)
		.filter((action) => typeof action === 'object');
	const transitionsProps = Object.keys(Object.assign({}, ...toStyles));

	const to = {};
	for (const p of transitionsProps)
		to[p] = styleProps[p] === undefined ? MISSING : styleProps[p];

	return { ...perso, to };
}
