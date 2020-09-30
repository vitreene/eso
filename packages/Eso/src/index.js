import { o } from "sinuous";

import { storeNodes } from "./register/create-perso";

import { Img } from "./composants/Img";
import { Toto, Bloc, Blek } from "./composants/Bloc";

function exe() {
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
	};

	const inner = {
		classes: "inner",
		// content: counter,
		onclick: function (e) {
			console.log(this);
		},
	};

	const img = {
		classes: "mysvg",
		dimensions: { width: 50, height: 100 },
		content: "./img/Aesthedes.jpg",
	};

	const casting = {
		outer: new Toto({ id: "outer", initial: outer }),
		// inner: new Bloc({ id: "inner", tag: "button", initial: inner }),
		inner: new Blek({ id: "inner", tag: "section", initial: inner }),
		img: new Img({ id: "picture", initial: img }),
	};

	console.log(casting);
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
	document.body.append(storeNodes.get(casting.img.uuid));

	const interval = setInterval(() => {
		counter(counter() + 1);
		if (counter() === 10) clearInterval(interval);
	}, 2000);

	setTimeout(() => {
		casting.outer.update(updatePerso);

		casting.img.update({
			dimensions: { width: 250, height: 500 },
			classes: "tutu",
			content: "./img/Aesthedes.jpg",
		});
	}, 2000);

	setTimeout(() => {
		casting.inner.update(updatePerso2);
	}, 3000);
}

setTimeout(exe, 1000);
