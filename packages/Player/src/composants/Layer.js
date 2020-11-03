import { html } from 'sinuous';

import { Eso } from 'veso';
import { Slot } from './slot';
import { DEFAULT_STYLES } from '../data/constantes';

export class Layer extends Eso {
	static nature = 'layer';
	render(props) {
		const layout = innerLayer(props.content(), props.id());
		return html`<section
			id=${props.id}
			style=${props.style}
			class=${props.class}
		>
			${layout}
		</section>`;
	}
}

function innerLayer(content, layerId) {
	if (!content || Object.keys(content).length === 0) return null;
	const layer = [];
	for (const config of content) {
		const id = joinId(layerId, config.id);
		const item = new LayerItem({
			style: keyToLowercase(config.statStyle),
			class: config.className,
			id,
		});
		layer.push(item);
	}
	return layer;
}

function LayerItem(props) {
	const slot = new Slot({ uuid: props.id });
	return html`<article id=${props.id} style=${props.style} class=${props.class}>
		${slot}
	</article>`;
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
