import { Eso } from 'veso';

import { StageEntry } from '../../../types/Entries-types';

export class Stage {
	static deZoom = (obj, zoom) => {
		if (obj.constructor !== Object) return obj;
		const o = {};
		for (const p in obj) {
			o[p] = typeof obj[p] === 'number' ? obj[p] / zoom : obj[p];
		}
		return o;
	};
	// static singleton = false;

	box: Box = defaultBox;
	el: Element;
	stage: StageEntry;
	renderOnResize: Function;

	/**
	 *
	 * @param {string | Element} node - id de la scène, doit etre déjà créé
	 * @param {StageEntry} stage - dimensions de la scène virtuelle
	 * @param {Number} stage.w - largeur de la scène virtuelle : 1600
	 * @param {Number} stage.h - hauteur de la scène virtuelle : 900
	 * @param {Number} stage.r - ratio de la scène virtuelle : 16 / 9
	 * @param {function} handler - callback appelé quand le zoom change
	 */

	constructor(node: string | Element, stage: StageEntry, handler: Function) {
		// if (Zoom.singleton) return this;
		// Zoom.singleton = true;
		this.resize = this.resize.bind(this);
		this.setZoom = this.setZoom.bind(this);

		this.el = typeof node === 'string' ? document.getElementById(node) : node;
		if (!this.el) console.warn('id %s element not found', node);
		this.stage = stage;
		this.renderOnResize = handler;
		this.box = this.setZoom();
	}

	get value() {
		return this.box;
	}

	resize() {
		const zoom = this.setZoom();
		if (!idem(this.box, zoom)) {
			this.box = zoom;
			console.log('resize', this.box.zoom);
			this.renderOnResize && this.renderOnResize(zoom);
		}
	}

	unZoom(obj) {
		return Stage.deZoom(obj, this.value);
	}
	setZoom(): Box {
		if (!this.el) return defaultBox;
		// determiner l'échelle du projet, comparée à sa valeur par défaut.
		const width = this.el.clientWidth;
		const height = this.el.clientHeight;
		const wZoom = width / this.stage.w;
		const hScene = wZoom * this.stage.h;

		if (hScene > height) {
			const zoom = height / this.stage.h;
			const wScene = this.stage.w * zoom;
			return round({
				left: (width - wScene) / 2,
				top: 0,
				width: wScene,
				height,
				ratio: wScene / height,
				zoom,
			});
		} else {
			return round({
				left: 0,
				top: (height - hScene) / 2,
				width,
				height: hScene,
				ratio: hScene / width,
				zoom: wZoom,
			});
		}
	}
}

export function round(obj: Object): any {
	const r = {};
	for (const e in obj) {
		r[e] = parseFloat(obj[e].toFixed(2));
	}
	return r;
}

type Box = {
	left: number;
	top: number;
	width: number;
	height: number;
	ratio: number;
	zoom: number;
};
const defaultBox: Box = {
	left: 0,
	top: 0,
	width: 0,
	height: 0,
	ratio: 1,
	zoom: 1,
};

function idem(o1, o2) {
	let res = true;
	for (const p in o1) {
		if (o1[p] !== o2[p]) {
			res = false;
			break;
		}
	}
	return res;
}

export function getElementOffsetZoomed(el, z) {
	return Stage.deZoom(Eso.getElementOffset(el), z);
}
