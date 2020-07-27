import { o } from "sinuous";
import { Eso } from "./eso";

import { storeNodes } from "./register/create-perso";

class Toto extends Eso {
	constructor(props) {
		super(props);
		this.revision.toto = {
			update(props, state) {
				console.log("(props, state)", props, state);
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
	onclick: function (e) {
		console.log(this);
	},
	content: "vat",
};

const inner = {
	classes: "inner",
	content: counter,
};

const casting = {
	outer: new Toto({ id: "outer", perso: "bloc", initial: outer }),
	inner: new Eso({ id: "inner", perso: "bloc", initial: inner }),
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
	transition: {
		// from: { color: "#e4349e" },
		to: { color: "#5fe434" },
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
	casting.outer.update(updatePerso2);
}, 2000);
