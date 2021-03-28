import { Eso } from '../App/init';
import { MISSING } from '../data/constantes';
import { mergeDimensions } from '../../../Veso/src/transitions';

/* 
FIXME mettre au propre :
- dimensions fait partie de "pre" (il en est l'unique composant pour le moment)
ce sont des facilités qui sont ensuite fusionnées dans les props standard

- dimensions est en doublon, utilisé dans register ; ici aussi un "pre" est necessaire
attention la fonction a varié et integre le parametre "original"

- si "pre" est dans Veso, l'importer depuis Eso ; pas d'import direct comme ci-dessus

*/

// // déclenche les updates ; appelé par chaque action
export function updateComponent(
	perso,
	{ changed, update, ...others },
	box,
	updateSlot
) {
	if (!update || Object.keys(update).length === 0) return;
	if (typeof changed === 'string') {
		console.error(changed, update, others);
		return;
	}
	if (changed.status === 'enter') {
		// Le node existe, je peux completer les props pour les transitions
		perso = updateMissingProps(perso);
		// zoom enter
		perso.prerender(box.zoom);
	}

	// RESLOT , RESCALE, TRANSITIONS,
	Eso.transition({ perso, update, changed, box, updateSlot });

	// PRE : DIMENSIONS
	perso.update(mergeDimensions(update));
}

let body;
function updateMissingProps(perso) {
	if (window || perso.to) {
		let css;
		for (const prop in perso.to) {
			if (perso.to[prop] === MISSING) {
				!css && (css = window.getComputedStyle(perso.node));
				!body && (body = window.getComputedStyle(document.body));
				perso.to[prop] = css[prop] || body[prop];
			}
		}
	}
	return perso;
}
