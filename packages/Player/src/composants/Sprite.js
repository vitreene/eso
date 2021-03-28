import { html } from 'sinuous';
import { Eso } from '../App/init';

export class Sprite extends Eso {
	static nature = 'sprite';

	render(props) {
		const { id, content, attr, ...others } = props;
		return html`<img id=${id} src=${content} ...${others} ...${attr} />`;
	}
}
