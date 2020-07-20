import { o, api } from "sinuous";

export function render(props) {
	console.log("this.current", props);
	for (const p in props) {
		if (!this.attributes[p]) {
			this.attributes[p] = o(props[p]);
			this.node && api.property(this.node, this.attributes[p], p);
		} else {
			this.attributes[p](props[p]);
		}
		console.log("this.attributes[%s]", p, this.attributes[p]());
	}

	console.log("attributes", this.attributes);
	console.log("this.current", this.current);
}
