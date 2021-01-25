import { Eso } from '../App/init';

// // déclenche les updates ; appelé par chaque action

export function updateComponent(
	perso,
	{ changed, update, ...others },
	box,
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
/*  const dimensions = doDim(update.dimensions);
	const classStyle = {
		...(update && update.classStyle),
		...(dimensions && dimensions.classStyle),
	};
	update.dimensions && console.log(perso.id, update.dimensions, dimensions);
	perso.update({ ...update, transition, classStyle });
}
 */
