import { getElementOffset } from '../shared/get-element-offset';
import { DEFAULT_DURATION } from '../shared/constantes';
import { toArray } from '../shared/utils';
/* 
FIXME
- rescale Bloc, doit prendre en compte la taille du bloc, pas du parent
- quend reslot et transition, la mise à l'echelle est perdue
*/

export function reslot({ transition, ...props }) {
	const { perso, changed, box, updateSlot } = props;

	const __pre = [...toArray(transition)];
	let old;
	let current;
	const rescale = props.update.move?.rescale;
	const progress = props.update.move?.progress;
	const duration = props.update.move?.duration || DEFAULT_DURATION;

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
			duration,
			direct: true,
			...(progress && { progress }),
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
				duration,
				direct: true,
				...(progress && { progress }),
			});
		}
	}
	console.log('reslot', perso.id, changed, props.update.move);
	console.log('transition', __pre, transition);
	return { ...props, transition };
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
