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
	dynStyle: { color: "red" },
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

const updatePerso = {
	toto: "tsoin-tsoin",
	dynStyle: { color: "", "font-weight": "bold" },
	classes: "tontonton",
	statStyle: { color: "blue", "font-size": "24px" },
	"data-config": "tintin",
	transition: {
		from: { color: "#e1d1f1" },
		to: { color: "#a1d1e1" },
	},
	content: storeNodes.get(casting.inner.uuid),
};

const interval = setInterval(() => {
	counter(counter() + 1);
	if (counter() === 10) clearInterval(interval);
}, 1000);

document.body.append(storeNodes.get(casting.outer.uuid));

setTimeout(() => {
	casting.outer.update(updatePerso);
	counter(counter() + 1);
	if (counter() === 10) clearInterval(interval);
}, 1000);
