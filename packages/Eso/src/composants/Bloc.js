import { Eso } from "../eso";
import { api } from "sinuous";
const { h } = api;

export class Bloc extends Eso {
	render(props) {
		const { tag = "div", content = "", ...attrs } = props;
		return h(tag, attrs, content);
	}
}
export class Toto extends Bloc {
	constructor(props) {
		super(props);
		this.revision.toto = {
			update(props, state) {
				console.log("(TOTO)", props, state);
				return props;
			},
		};
	}
}
