/* 
entree : 
- options.from, 
- options.to,
- duration,

- styler

sortie : {from, to, duration}
*/
import { getComputedStyle } from '../create-perso';
import { transformColor, isColorFactory } from './colors';
import { keyToLowercase, stringToLowercase } from './js-to-css';

import { DEFAULT_STYLES, DEFAULT_DURATION } from './constantes';

export function fromTo(opts, store, uuid) {
	if (!opts.from && !opts.to) return null;
	const { duration = DEFAULT_DURATION } = opts;
	const options = {};
	for (const prop in opts) options[prop] = keyToLowercase(opts[prop]);
	uuid.id === 'text-sample' &&
		console.log('%s, opts, options', uuid.id, opts, options);

	let keyStore, styler;

	const from = {};
	const to = {};

	// retirer les valeurs egales
	// ne garder que les props de to dans from
	// si une prop de from manque la lire depuis le store / default / styler

	// TODO convertir si les unités sont différentes
	// unitlss / px  (plus tard px / vw,vh,%...)

	for (const key in options.to) {
		if (options.from[key] === options.to[key]) continue;
		if (options.from.hasOwnProperty(key)) {
			from[key] = options.from[key];
			to[key] = options.to[key];
		} else {
			if (!keyStore) keyStore = flattenStore(store);
			if (key in keyStore) from[key] = keyStore[key];
			else {
				if (!styler) styler = getComputedStyle(uuid);
				from[key] = styler.getPropertyValue(stringToLowercase(key));
			}
			to[key] = options.to[key];
		}
	}
	if (Object.keys(to).length < 1) return null;

	// convertir couleurs et valeurs
	for (const key in from) from[key] = getCssValue(from[key]);
	for (const key in to) to[key] = getCssValue(to[key]);

	return {
		from,
		to,
		duration,
	};
}

const isColor = isColorFactory();

function getCssValue(cssProp) {
	const val = isColor(cssProp)
		? transformColor(cssProp)
		: isNaN(cssProp)
		? cssProp
		: parseFloat(cssProp);
	return val;
}

function flattenStore(store) {
	const { dynStyle, dimensions, between, statStyle } = store;
	const flatStore = {
		...DEFAULT_STYLES,
		...statStyle,
		...dimensions,
		...dynStyle,
		...between,
	};
	return flatStore;
}
