/*
signature : 
entrée: state, props 
sortie: newProps

Le state - objet style du node - n'est pas modifié
- seules les modifications sont envoyées
- elles seront fusionnées au moment de traiter la timeline
- la timeline enregistre les modifs successives
- les modifs sont ajoutées au state dans le store

Prerender 
  - recoit à l'init et au resize la valeur de zoom, qui est mise en cache. 
  - resoud les valeurs unitless 
  - recalcule entièrement transform s'il recoit une valeur le modifiant
  sortie : style

 */

import { css, setup } from 'goober';
import { prefix } from 'goober-autoprefixer';

import { whiteListCssProps } from '../shared/constantes';
import { pipe } from '../shared/utils';
import { mapRelatives } from '../shared/map-relatives';
import { extractTransform, withTransform } from '../shared/transform';
import { keyToLowercase, stringToLowercase } from '../shared/js-to-css';

setup(null, prefix);
const whiteListCss = new Set(Array.from(whiteListCssProps, stringToLowercase));

export const doStyle = {
	css(style) {
		return css(style);
	},
	update(props, state) {
		const mapProps = mapRelatives(state);
		const newStyle = pipe(mapProps, removeEmptyProps, keyToLowercase)(props);
		// console.log(props, newStyle);
		return newStyle;
	},
	prerender(box, newStyle) {
		// console.log('newStyle', newStyle);
		if (!newStyle) return;
		// console.log('BOX', box);
		if (!box) box = defaultBox;
		if (typeof box === 'number') box = { ...defaultBox, zoom: box };

		// calculer styles : appliquer zoom sur unitless
		const newRenderStyle = {};
		for (const prop in newStyle) {
			if (whiteListCss.has(prop) && typeof newStyle[prop] === 'number') {
				newRenderStyle[prop] = newStyle[prop] * box.zoom + 'px';
			} else newRenderStyle[prop] = newStyle[prop];
		}

		// TODO placer des limites pour font-size :
		// https://css-tricks.com/simplified-fluid-typography/

		if ('font-size' in newStyle && typeof newStyle['font-size'] === 'number') {
			newRenderStyle['font-size'] = newStyle['font-size'] * box.zoom + 'px';
		}
		// if ('font-size' in newStyle) {
		// 	console.log('newStyle[font-size]', newStyle['font-size']);
		// 	console.log('newRenderStyle[font-size]', newRenderStyle['font-size']);
		// }

		const { style, transform } = extractTransform(newRenderStyle);

		return {
			...style,
			...withTransform(transform, box.zoom),
		};
	},
};

const defaultBox = {
	left: 0,
	top: 0,
	width: 0,
	height: 0,
	ratio: 1,
	zoom: 1,
};

function removeEmptyProps(props) {
	const values = {};
	for (const val in props) if (isValue(props[val])) values[val] = props[val];
	return values;
}

// 0 est une valeur valable
function isValue(val) {
	return val !== undefined && val !== null && val !== '';
}
