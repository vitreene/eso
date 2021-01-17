import { Zoom } from '../src/zoom';
import { Eso } from 'veso';
import { CONTAINER_ESO, SCENE_STAGE } from '../src/data/constantes';
// ============================================================
// zoom est partagé par updateScene
// sera dispo dans un store global

export let zoom;

export function getElementOffsetZoomed(el, z) {
	return Zoom.deZoom(Eso.getElementOffset(el), z);
}

// zoom dans listener resize
export function activateZoom(handler) {
	zoom = new Zoom(CONTAINER_ESO, SCENE_STAGE['4/3'], handler);
	window.addEventListener('resize', zoom.resize);
	return () => window.removeEventListener('resize', zoom.resize);
}
