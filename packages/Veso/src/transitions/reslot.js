import { getElementOffset } from '../shared/get-element-offset';
import { DEFAULT_DURATION } from '../shared/constantes';
/* 
FIXME
- rescale Bloc, doit prendre en compte la taille du bloc, pas du parent
- quend reslot et transition, la mise à l'echelle est perdue
*/
export function reslot({ perso, update, changed, box, updateSlot }) {
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
		old = getElementOffsetZoomed(perso.node, box.zoom);
		updateSlot(...changed.remove);
	}

	if (changed?.add) {
		updateSlot(...changed.add);
		const node = rescale ? perso.node.parentNode : perso.node;
		current = getElementOffsetZoomed(node, box.zoom);
	}

	if (old && current) {
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
	return transition.length === 0 ? null : transition.reverse();
}

function getElementOffsetZoomed(el, z) {
	return deZoom(getElementOffset(el), z);
}

function deZoom(obj, zoom) {
	if (obj.constructor !== Object) return obj;
	const o = {};
	for (const p in obj) {
		o[p] = typeof obj[p] === 'number' ? obj[p] / zoom : obj[p];
	}
	return o;
}
