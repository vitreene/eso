import { o, svg, html, api } from 'sinuous';
import { computed } from 'sinuous/observable';

import { Eso } from 'veso';

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

export function createImgClass(imageCollection) {
	return class Img extends Eso {
		static nature = 'img';
		constructor(story, emitter) {
			super(story, emitter);
			imageCollection.has(story.initial.content) &&
				this.img(imageCollection.get(story.initial.content));
			this.fit(story.initial.fit);
		}

		// TODO ajouter img à this.content
		update(props) {
			super.update(props);
			const hasContent = props.content && imageCollection.has(props.content);
			hasContent && this.img(imageCollection.get(props.content));
			props.fit && this.fit(props.fit);
		}

		render(props) {
			const { id, content, fit, ...attrs } = props;
			this.img = o({});
			this.fit = o(fit);

			const viewBox = computed(
				() => `0 0 ${this.img()?.width || 0} ${this.img()?.height || 0}`
			);
			const src = computed(() => this.img()?.src);
			const preserveAspectRatio = computed(
				() => `xMidYMid ${constrainImage[this.fit()]}` || 'slice'
			);
			return svg`<svg
        id=${id}
        viewBox=${viewBox}
        preserveAspectRatio=${preserveAspectRatio}
        ...${attrs}
      >
        <image  href=${src} width="100%" height="100%" />
      </svg>`;
		}
	};
}
