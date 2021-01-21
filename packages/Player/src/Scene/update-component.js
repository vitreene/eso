import { getElementOffsetZoomed } from '../zoom';
import { DEFAULT_DURATION } from '../data/constantes';

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
	const rescale = update.move?.rescale;

	// zoom enter
	if (update.enter) perso.prerender(box.zoom);

	// RESLOT et RESCALE
	let old,
		current,
		transition = [];

	if (update.transition) {
		Array.isArray(update.transition)
			? transition.push(...update.transition)
			: transition.push(update.transition);
	}

	if (changed?.remove) {
		if (perso) {
			const node = rescale ? perso.node.parentNode : perso.node;
			old = getElementOffsetZoomed(node, box.zoom);
		}
		updateSlot(...changed.remove);
	}

	if (changed?.add) {
		updateSlot(...changed.add);
		if (perso) {
			const node = rescale ? perso.node.parentNode : perso.node;
			current = getElementOffsetZoomed(node, box.zoom);
		}
	}

	if (old && current) {
		// en cas de resize, il faudrait recalculer la position des blocs, en gardant la valeur progress de l'interpolation
		const position = {
			dX: old.x - current.x,
			dY: old.y - current.y,
		};

		transition.push({
			from: position,
			to: { dX: 0, dY: 0 },
			duration: DEFAULT_DURATION,
		});

		// rescale
		// expression en % = responsive au resize
		if (rescale) {
			const oldDimensions = {
				width: (old.width / current.width) * 100 + '%',
				height: (old.height / current.height) * 100 + '%',
			};
			const currentDimensions = {
				width: '100%',
				height: '100%',
			};

			transition.push({
				from: oldDimensions,
				to: currentDimensions,
				duration: DEFAULT_DURATION,
			});
		}
	}

	perso.update({ ...update, transition });
}
