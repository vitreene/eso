import { o, api } from "sinuous";
const { h } = api;
import { Eso } from "./eso";

import { storeNodes } from "./register/create-perso";

class Bloc extends Eso {
	render(props) {
		const { tag = "div", content = "", ...attrs } = props;
		return h(tag, attrs, content);
	}
}

class Toto extends Bloc {
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

const counter = o(0);

const outer = {
	classes: "outer",
	statStyle: {
		"background-color": "royalblue",
		padding: "1rem",
		margin: "auto",
	},
	dynStyle: {
		color: "#ff0000",
	},

	content: "vat",
	// tag: "article",
};

const inner = {
	classes: "inner",
	content: counter,
	// tag: "button",
	onclick: function (e) {
		console.log(this);
	},
};

const casting = {
	outer: new Toto({ id: "outer", initial: outer }),
	inner: new Bloc({ id: "inner", tag: "button", initial: inner }),
};

// TODO comment retirer une prop de style ?
const updatePerso = {
	toto: "tsoin-tsoin",
	dynStyle: { color: "", "font-weight": "bold" },
	classes: "tontonton",
	statStyle: { color: "#00ff00", "font-size": "24px" },
	"data-config": "tintin",
	content: storeNodes.get(casting.inner.uuid),
	transition: {},
};
const updatePerso2 = {
	statStyle: {
		"font-weight": "bold",
		"text-align": "center",
	},
	transition: {
		// from: { color: "#e4349e" },
		to: { "font-size": "48px", color: "#5fe434" },
		duration: 2500,
	},
};

document.body.append(storeNodes.get(casting.outer.uuid));

const interval = setInterval(() => {
	counter(counter() + 1);
	if (counter() === 10) clearInterval(interval);
}, 1000);

setTimeout(() => {
	casting.outer.update(updatePerso);
}, 1000);

setTimeout(() => {
	casting.inner.update(updatePerso2);
}, 2000);
