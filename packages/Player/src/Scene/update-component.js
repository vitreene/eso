import { Eso } from '../App/init';

// // déclenche les updates ; appelé par chaque action

export function updateComponent(
	box,
	perso,
	{ changed, update, ...others },
	updateSlot
) {
	// console.log('update', update);
	if (!update || Object.keys(update).length === 0) return;
	if (typeof changed === 'string') {
		console.error(changed, update, others);
		return;
	}

	// zoom enter
	if (update.enter) perso.prerender(box.zoom);

	// RESLOT , RESCALE, TRANSITIONS
	Eso.transition({ perso, update, changed, box, updateSlot });

	perso.update(update);
}
