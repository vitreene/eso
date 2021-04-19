import { api } from 'sinuous';

import { doDimensions } from '../Scene/pre/dimensions';
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

function preInit(persoInitial, additionnalStyles = {}) {
	const { dimensions, classStyle, ...initial } = persoInitial;
	const dims = doDimensions(dimensions);
	const _classStyle = {
		...classStyle,
		...additionnalStyles,
		...dims,
	};
	return { ...initial, classStyle: _classStyle };
}

/* 
teste si un text est du html, pourrait etre utilisé au parsage pour déterminer quel Content utiliser.
-> on peut imaginer interdire le html au runtime (pas d'input donnant du html)

https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/15458987
*/
function isHTML(str) {
	var doc = new DOMParser().parseFromString(str, 'text/html');
	return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
}
