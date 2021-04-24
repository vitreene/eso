import { html } from 'sinuous';

import { DEFAULT_STYLES } from '../shared/constantes';

export class LayerContent {
	static type = 'layer';
	constructor(slotFn) {
		this.content = this.content(slotFn);
	}

	content(slot) {
		return {
			update(content) {
				return typeof content === 'string'
					? this.slot(content)
					: innerLayer(content, slot);
			},
			prerender(el) {
				return el;
			},
		};
	}
}

function innerLayer(content, slot) {
	if (!content || Object.keys(content).length === 0) return null;
	const layer = [];
	for (const config of content) {
		const id = config.id;
		const item = new LayerItem(
			{
				style: keyToLowercase(config.classStyle),
				class: 'layer-item ' + (config.className ? config.className : ''),
				id,
			},
			slot
		);
		layer.push(item);
	}
	return layer;
}

function LayerItem({ id, ...attrs }, slot) {
	const _slot = slot(id);
	return html`<article id=${id} ...${attrs}>${_slot}</article>`;
}

function keyToLowercase(obj) {
	const objLc = {};
	for (const prop in obj) objLc[stringToLowercase(prop)] = obj[prop];
	return objLc;
}

const exceptions = new Set(Object.keys(DEFAULT_STYLES));
function stringToLowercase(str) {
	return exceptions.has(str)
		? str
		: str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
