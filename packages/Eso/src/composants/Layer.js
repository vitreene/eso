import { o, api, html } from "sinuous";
const { h } = api;

import { Eso } from "../eso";
import { Slot } from "./Slot";

export class Layer extends Eso {
	static nature = "layer";
	constructor(_initial, emitter) {
		const { layout, ...initial } = _initial;
		super(initial, emitter);
		this.layout = layout;
	}

	render(props) {
		console.log("RENDER", props, this.layout);
		return (
			<section id={this.id} style={props.style} class={props.class}>
				{innerLayer(this.layout, this.id)}
			</section>
		);
	}
}

class LayerItem extends Eso {
	static nature = "bloc";
	render(props) {
		const slot = new Slot({ statStyle: config.statStyle, id: this.id });

		return (
			<article id={this.id} style={props.style} class={props.class}>
				{slot}
			</article>
		);
	}
}

function innerLayer(content, layerId) {
	if (!content || Object.keys(content).length === 0) return;
	const layer = [];
	for (const config of content) {
		const id = joinId(layerId, config.id);
		const item = new LayerItem({ statStyle: config.statStyle, id });
		layer.push(item);
	}
	console.log("innerLayer", layer);

	return layer;
	// return h(layer);
}
