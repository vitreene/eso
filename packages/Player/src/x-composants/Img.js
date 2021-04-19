import { svg, api } from 'sinuous';
import { computed } from 'sinuous/observable';
import { DEFAULT_FIT } from '../data/constantes';

// HACK en attendant une mise à jour
import { property } from '../../../Veso/src/shared/property';
api.property = property;

// cache l'implémentation
const constrainImage = {
	contain: 'meet',
	cover: 'slice',
	meet: 'contain',
	slice: 'cover',
	undefined: 'slice',
};

// const contentImg = (collection) => {
// 	return {
// 		update(content, current) {
// 			const { src, fit } =
// 				typeof content === 'string'
// 					? { src: content, fit: content.fit || current?.fit || DEFAULT_FIT }
// 					: content;
// 			const img = collection.has(src) && collection.get(src);
// 			return { img, fit };
// 		},
// 	};
// };
export const img = (Eso) =>
	class Img extends Eso {
		static nature = 'img';
		static contentType = 'image';

		// constructor(perso, collection) {
		// 	super(perso, { init: false });
		// 	this.revision.content = contentImg(collection);
		// 	this.init();
		// }

		render(props) {
			const { id, content, ...attrs } = props;
			const viewBox = computed(
				() => `0 0 ${content().img?.width || 0} ${content().img?.height || 0}`
			);
			const src = computed(() => content().img?.src);
			const preserveAspectRatio = computed(
				() => `xMidYMid ${constrainImage[content().fit]}` || 'slice'
			);
			return svg`
			<svg
        id=${id}
        viewBox=${viewBox}
        preserveAspectRatio=${preserveAspectRatio}
        ...${attrs}
      >
        <image  href=${src} width="100%" height="100%" />
      </svg>`;
		}
	};
