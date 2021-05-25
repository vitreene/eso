import { api } from 'sinuous';

const { h } = api;
export const input = (Eso) =>
	class Input extends Eso {
		static nature = 'input';
		static contentType = 'text';

		render(props) {
			const { tag = 'input', content, ...attrs } = props;
			return h(tag, { ...attrs }, content);
		}
	};
