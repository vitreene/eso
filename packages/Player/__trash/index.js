import { o } from 'sinuous';
import { storeNodes } from 'veso';
import './index.css';

import { STRAP, TC, PAUSE } from './data/constantes';
import { Img } from './composants/Img';
import { Toto, Bloc } from './composants/Bloc';
import { Perso } from './composants/Perso';
import { storeSlots, Slot } from './composants/slot';
import { Layer } from './composants/Layer';

import { layerGrid01 } from './stories/story01/layer';

export const emitter = { emit: (...args) => console.log('EMIT----->', args) };

function exe() {
	const $layer = new Layer(layerGrid01, emitter);
	const counter = o(0);
	const uuid = 'unikid';

	const $slotTest = new Slot({ uuid });

	const $test = new Perso(
		{
			id: 'test',
			initial: { classes: 'perso', content: 'PPPERSOOO' },
			emit: {
				mousedown: {
					event: { channel: STRAP, name: 'move' },
					data: { id: 'text-sample', event: 'move' },
				},
				click: {
					event: { channel: TC, name: PAUSE },
				},
			},
		},
		emitter
	);

	const outer = {
		classes: 'outer',
		classStyle: {
			'background-color': 'royalblue',
			padding: '1rem',
			margin: 'auto',
		},
		style: {
			color: '#ff0000',
		},

		content: $test,
	};

	const inner = {
		classes: 'inner',
		content: counter,
		onclick: function (e) {
			console.log(this);
		},
	};

	const img = {
		classes: 'mysvg',
		dimensions: { width: 50, height: 100 },
		content: './ikono/Aesthedes.jpg',
	};

	const casting = {
		outer: new Toto({ id: 'outer', initial: outer }, emitter),
		inner: new Bloc({ id: 'inner', tag: 'button', initial: inner }, emitter),
		slot: $slotTest,
		img: new Img({ id: 'picture', initial: img }, emitter),
	};

	console.log('casting', casting);

	// TODO comment retirer une prop de style ?
	const updatePerso = {
		toto: 'tsoin-tsoin',
		style: { color: '', 'font-weight': 'bold' },
		classes: 'tontonton',
		classStyle: { color: '#00ff00', 'font-size': '24px' },
		'data-config': 'tintin',
		// content: storeNodes.get(casting.inner.uuid),
		transition: {},
	};
	const updatePerso2 = {
		classStyle: {
			'font-weight': 'bold',
			'text-align': 'center',
		},
		transition: {
			from: { color: '#e4349e' },
			to: { 'font-size': '48px', color: '#5fe434' },
			duration: 2500,
		},
	};

	document.body.append(storeNodes.get(casting.outer.uuid));
	document.body.append(storeNodes.get(casting.img.uuid));
	// document.body.append(casting.slot);
	document.body.append(storeNodes.get($layer.uuid));

	const interval = setInterval(() => {
		counter(counter() + 1);
		if (counter() === 10) clearInterval(interval);
	}, 2000);

	setTimeout(() => {
		casting.outer.update(updatePerso);

		casting.img.update({
			dimensions: { width: 250, height: 500 },
			classes: 'tutu',
			content: './ikono/Aesthedes.jpg',
		});
	}, 2000);

	setTimeout(() => {
		storeSlots.get('grid-01_s01')(`le bon numéro : ${Math.random()}`);
		$test({ content: 'Lululululu', style: { color: 'white' } });
		casting.inner.update(updatePerso2);
		storeSlots.get(uuid)(storeNodes.get(casting.img.uuid));
	}, 3000);
}

setTimeout(exe, 1000);
