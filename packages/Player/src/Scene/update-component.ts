import { mergeDimensions } from '../../../Veso/src/shared/dimensions';

import { MISSING } from '../data/constantes';

// // déclenche les updates ; appelé par chaque action
export function updateComponent(
	perso,
	{ changed, update, ...others },
	box,
	updateSlot,
	transition
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
		update = enterMoveRescale(update);
	}
	// RESLOT , RESCALE, TRANSITIONS,
	transition({ perso, update, changed, box, updateSlot });

	// PRE : DIMENSIONS
	const mergedUpdate = mergeDimensions(update);
	perso.update(mergedUpdate);
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

function enterMoveRescale(update) {
	// console.log(update);

	if (update.move?.rescale) {
		return {
			...update,
			style: {
				...update.style,
				width: '100%',
				height: '100%',
			},
		};
	}
	return update;
}
