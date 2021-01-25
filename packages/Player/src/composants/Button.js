import { html } from 'sinuous';
import { Eso } from '../App/init';

export class Button extends Eso {
	static nature = 'button';
	render({ id, content, ...attrs }) {
		return html`<button id=${id} ...${attrs}>${content}</button>`;
	}
}
