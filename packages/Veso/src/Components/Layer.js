import { html } from 'sinuous';

export const layer = (Eso) =>
	class Layer extends Eso {
		static nature = 'layer';
		static contentType = 'layer';
		render({ id, content, ...attrs }) {
			return html`<section id=${id} ...${attrs}>${content}</section>`;
		}
	};
