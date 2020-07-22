import { o, api } from "sinuous";
import { storeNodes } from "../register/create-perso";

export function render(current) {
	const node = storeNodes.get(this.uuid);
	for (const p in current) {
		if (!this.attributes[p]) {
			this.attributes[p] = o(current[p]);
			node && api.property(node, this.attributes[p], p);
		} else {
			this.attributes[p](current[p]);
		}
		// console.log("current[%s]", p, current[p]);
	}

	// console.log("attributes", this.attributes);
	// console.log("this.current", this.current);
}
