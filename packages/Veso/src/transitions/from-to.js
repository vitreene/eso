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

/* 
FIXME si une transition implique move seulement, il faut pouvoir revenir à l'état initial 
une transition doit pouvoir invalider la précédente en cours  ou bien alors fusionner en mixant les deux ?

comment invalider une transition ?
- memes propriétés , les durées ne comptent pas
- stopper la transition
- les props concernées sont retirées
- une nouvelle transition qui démarre de l'état en cours vers la fin
- sitransition vide, l'annuler
- lancer la transition suivante

transition additive : ce qui changerait ? 
en sortie des transitions, mixer les valeurs : moyenne pondérée de l'influence de l'ancienne valeur , de 100% à 0% sur la durée de la transition la plus récente ?
ce modele doit s'appliquer quel que soit le nombre de transitions..
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
	const from = {};
	const to = {};

	const propsFrom = { ...perso.to, ...perso.from, ...transition.from };
	const propsTo = transition.to;

	for (const key in propsTo) {
		const f = getCssValue(propsFrom[key]);
		const t = getCssValue(propsTo[key]);
		// removeEqualProperties
		if (f !== t) {
			from[key] = f;
			to[key] = t;
		}
	}
	return filterEmptyTransition({ ...transition, from, to, duration });
}

function filterEmptyTransition(transition) {
	if (!transition) return null;
	const isEmpty =
		typeof transition.from === 'object' &&
		!Object.keys(transition.from).length &&
		typeof transition.to === 'object' &&
		!Object.keys(transition.to).length;
	return isEmpty ? null : transition;
}
