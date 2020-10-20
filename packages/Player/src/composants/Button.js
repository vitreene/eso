import { html } from 'sinuous';
import { Eso } from 'veso';

export class Button extends Eso {
  static nature = 'button';
  render({ id, content, ...attrs }) {
    return html`<button id=${id} ...${attrs}>${content}</button>`;
  }
}
