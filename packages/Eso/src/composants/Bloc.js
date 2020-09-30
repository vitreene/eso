import { Eso } from "../eso";
import { o, api, html } from "sinuous";
const { h } = api;
import { storeNodes } from "../register/create-perso";

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

const initial = {
	classes: "initial",
	statStyle: {
		"background-color": "royalblue",
		padding: "1rem",
		margin: "auto",
	},
	dynStyle: {
		color: "#ff0000",
	},

	content: "BLEK OUTER",
};

const innner = new Toto({ id: "initial", initial });

export class Blek extends Eso {
	render(props) {
		const { tag = "div", content = "TITIUT", ...attrs } = props;
		// return html`<div ${ attrs}>${() => innner}</div>`;
		return h(tag, attrs, storeNodes.get(innner.uuid));
	}
}
