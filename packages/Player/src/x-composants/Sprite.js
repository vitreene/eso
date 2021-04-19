import { html } from 'sinuous';

export const sprite = (Eso) =>
	class Sprite extends Eso {
		static nature = 'sprite';
		static contentType = 'image';

		render(props) {
			const { id, content, attr, ...others } = props;
			return html`<img id=${id} src=${content} ...${others} ...${attr} />`;
		}
	};