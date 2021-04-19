import { api } from 'sinuous';

const { h } = api;
// Composant minimal
export const bloc = (Eso) =>
	class Bloc extends Eso {
		static nature = 'bloc';
		static contentType = 'text';

		render(props) {
			const { tag = 'div', content = '', ...attrs } = props;
			return h(tag, { ...attrs }, content);
		}
	};

/* 
teste si un text est du html, pourrait etre utilisé au parsage pour déterminer quel Content utiliser.
-> on peut imaginer interdire le html au runtime (pas d'input donnant du html)

https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/15458987
*/
function isHTML(str) {
	var doc = new DOMParser().parseFromString(str, 'text/html');
	return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
}
