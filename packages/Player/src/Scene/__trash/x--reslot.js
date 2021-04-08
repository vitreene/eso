import { getElementOffsetZoomed } from '../../zoom';
import { DEFAULT_DURATION } from '../../data/constantes';

export function reslot(perso, update, changed, box, updateSlot) {
	let old,
		current,
		transition = [];

	const rescale = update.move?.rescale;

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
	return transition;
}
