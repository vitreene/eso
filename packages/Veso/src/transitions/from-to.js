/* 
FROM-TO v2

les valeurs à interpoler sont préparées à l'avance: 
to : { prop1: val1, prop2:val2, ...}
quand le perso est traité, ou bien quand le perso est entré sur scene, pour avoir des valeurs liées au DOM.

rappel: 
- form-to peut accepter un preset , a traiter avant d'arriver ici.
- si seul to a été défini, from = le style actuel.

mapper les props de to sur actuel pour obtenir from. 

entrée : perso.to, perso.from

*/

import { DEFAULT_DURATION } from '../shared/constantes';
import { getCssValue } from '../shared/colors';

/**
 *
 * @param {from, to, duration} transition
 * @param {Eso} perso
 */
export function fromTo({ direct = false, ...transition }, perso) {
	if (direct) return transition;
	const duration = transition.duration || DEFAULT_DURATION;
	let from = {},
		to = {};

	const propsFrom = { ...perso.to, ...perso.from, ...transition.from };
	const propsTo = { ...perso.to, ...transition.to };

	for (const key in perso.to) {
		from[key] = getCssValue(propsFrom[key]);
		to[key] = getCssValue(propsTo[key]);
	}
	return { from, to, duration };
}
