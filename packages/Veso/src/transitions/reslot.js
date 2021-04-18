import { getElementOffset } from '../shared/get-element-offset';
import { DEFAULT_DURATION } from '../shared/constantes';
/* 
FIXME
- rescale Bloc, doit prendre en compte la taille du bloc, pas du parent
- quend reslot et transition, la mise à l'echelle est perdue
*/

export function reslot({ transition, ...props }) {
	const { perso, changed, box, updateSlot } = props;
	perso.id === 'story01.image' && console.log('RESLOT update', props);

	let old;
	let current;
	const rescale = props.update.move?.rescale;

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
			direct: true,
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
				direct: true,
			});
		}
	}
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
