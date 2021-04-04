import { html } from 'sinuous';

export const button = (Eso) =>
	class Button extends Eso {
		static nature = 'button';
		render({ id, content, ...attrs }) {
			return html`<button id=${id} ...${attrs}>${content}</button>`;
		}
	};
