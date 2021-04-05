import { api } from 'sinuous';

const { h } = api;

export const list = (Eso) =>
	class List extends Eso {
		static nature = 'list';
		constructor(perso, slot) {
			perso.initial.content = slot(perso.id);
			super(perso);
		}
		render(props) {
			const { tag = 'div', content, ...attrs } = props;
			return h(tag, { ...attrs }, content);
		}
	};
