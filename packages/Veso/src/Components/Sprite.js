import { html } from 'sinuous';
import { computed } from 'sinuous/observable';

export const sprite = (Eso) =>
	class Sprite extends Eso {
		static nature = 'sprite';
		static contentType = 'image';

		render(props) {
			const { id, content, attr, ...others } = props;
			const src = computed(() => content().img?.src);
			return html`<img id=${id} src=${src} ...${others} ...${attr} />`;
		}
	};
