import { reslot } from './pre/reslot';
import { dimensions as doDim } from './pre/dimensions';

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

	// RESLOT et RESCALE
	const transition = reslot(perso, update, changed, box, updateSlot);

	// FIXME doit etre appelé à l'init !
	/* 
	Ne concerne que dimensions
	- soit passer 'pre' sur persos.initial avant leur création ?
	- X soit dimensions pourrait etre résolu dans transforms

	le reste ne concerne que les transitions : 'pre' peut se renommer 'transition'

	transition pourrait etre une fonction statique de Eso
	Eso serait initialisé avec emitter
	createEso(emiter) {return class Eso ...}
	*/

	perso.update({ ...update, transition });
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
