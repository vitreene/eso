import { svg, api } from 'sinuous';
import { computed } from 'sinuous/observable';

// HACK en attendant une mise à jour
import { property } from '../shared/property';
api.property = property;

// cache l'implémentation
const constrainImage = {
	contain: 'meet',
	cover: 'slice',
	meet: 'contain',
	slice: 'cover',
	undefined: 'slice',
};

export const img = (Eso) =>
	class Img extends Eso {
		static nature = 'img';
		static contentType = 'image';

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
