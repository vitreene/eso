import { html } from 'sinuous';

import { Eso } from 'veso';
import { DEFAULT_STYLES } from '../data/constantes';

// surcharger content
const contentRevision = (id, slot) => {
	console.log('slot', slot);
	return {
		update(content) {
			return typeof content === 'string'
				? slot(content)
				: innerLayer(content, id, slot);
		},
	};
};

export class Layer extends Eso {
	static nature = 'layer';
	constructor(story, emitter, slot) {
		story.initial.className = story.initial.className + ' layer-top ';
		super(story, emitter, false);
		this.revision.content = contentRevision(story.id, slot);
		this.init();
	}
	render({ id, content, ...attrs }) {
		return html`<section id=${id} ...${attrs}>${content}</section>`;
	}
}

function innerLayer(content, layerId, slot) {
	if (!content || Object.keys(content).length === 0) return null;
	const layer = [];
	for (const config of content) {
		const id = joinId(layerId, config.id);
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

// viennent de Eso/helpers
// un export pour une fonction simplifiée non-réactive, des classes et fonctions ?
function joinId(...args) {
	return args.filter((a) => a !== '').join('_');
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
