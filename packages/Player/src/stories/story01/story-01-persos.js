import {
	CONTAINER_ESO,
	STRAP,
	TC,
	PLAY,
	PAUSE,
	TOGGLE,
	DEFAULT_NS,
} from '../../data/constantes';

//FIXME  il doit entrer en scene et quitter
export const root = {
	id: CONTAINER_ESO,
	nature: 'layer',
	initial: {
		className: 'container',
		content: [
			{
				id: 's01',
				statStyle: {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'grid',
					gridColumn: 1,
					gridRow: 1,
					pointerEvents: 'none',
				},
			},
		],
	},
	listen: [{ event: 'leave-root', action: 'leave' }],
	actions: [{ name: 'leave', leave: true }],
};

export const layerFond = {
	id: 'fond',
	nature: 'layer',
	initial: {
		statStyle: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			display: 'grid',
			gridColumn: 1,
			gridRow: 1,
			backgroundColor: 'cyan',
		},
		content: [{ id: 's01' }],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
			transition: { to: 'fadeIn' },
		},
	],
};

export const layerGrid01 = {
	id: 'grid-01',
	nature: 'layer',
	initial: {
		statStyle: {
			position: 'absolute',
			top: 0,
			left: 0,
			display: 'grid',
			margin: '2rem',
			gridTemplateColumns: '6fr 4fr',
			gridTemplateRows: '4fr 3fr repeat(3, 1fr)',
			width: 'calc(100% - 4rem)',
			height: 'calc(100vmin - 8rem)',
		},
		content: [
			{
				id: 's01',
				statStyle: {
					gridColumn: '1 / 3',
					gridRow: 1,
				},
			},
			{
				id: 's02',
				statStyle: {
					gridColumn: 1,
					gridRow: '2 / 6',
				},
			},
			{ id: 's03', statStyle: { gridRow: 2 } },
			{ id: 's04', statStyle: { gridColumn: 2 } },
			{ id: 's05', statStyle: { gridColumn: 2 } },
			{ id: 's06', statStyle: { gridColumn: 2 } },
		],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
			transition: { to: 'fadeIn' },
		},
	],
};

export const textSample = {
	id: 'text-sample',
	nature: 'bloc',
	initial: {
		dimensions: { width: 421, height: 214 },
		className: 'totoo',
		statStyle: {
			color: 'blue',
			fontWeight: 'bold',
			// fontSize: '12px',
			padding: '8px',
		},
		attr: {
			'data-letter': 'alphabet',
		},
		content: 'dimanche',
	},
	emit: {
		mousedown: {
			event: { ns: STRAP, name: 'move' },
			data: { id: 'text-sample', event: 'move' },
		},
		click: {
			event: { ns: TC, name: PAUSE },
		},
	},

	listen: [
		{ event: 'ev011', action: 'enter' },
		{ event: 'ev012', action: 'step01' },
		{ event: 'ev014', action: 'step02' },
		{ event: 'move', action: 'move' },
	],
	actions: [
		{
			name: 'move',
		},
		{
			name: 'enter',
			move: { layer: 'grid-01', slot: 'grid-01_s01' },
			statStyle: {
				fontSize: 64,
				backgroundColor: '#ffff00',
				position: 'absolute',
			},
		},
		{
			name: 'step01',
			content: 'lundi',
			move: { layer: 'grid-01', slot: 'grid-01_s02' },
			transition: {
				to: {
					x: 100,
					y: 100,
					rotate: 200,
					scale: 0.4,
					fontSize: 100,
					backgroundColor: '#00ffff',
					color: '#0033FF',
				},
				duration: 2000, // race condition ?
			},
		},
		{
			name: 'step02',
			move: { layer: 'grid-01', slot: 'grid-01_s03' },
			transition: {
				to: {
					// x: 0,
					// y: 0,
					scale: 1.5,
					rotate: 40,
					// rotate: 360 * 4 + 45
					fontSize: 150,
					backgroundColor: '#00ff00',
					color: '#3300FF',
				},
				duration: 1000,
			},
			content: {
				lang: 'en',
				refLang: 'sous-titre',
				ref: 'txt01',
				effect: 'toto',
			},
		},
	],
};

export const imageSample = {
	id: 'image',
	nature: 'img',
	initial: {
		content: './ikono/vignette.jpg',
		fit: 'cover', //"cover"
		statStyle: {
			position: 'absolute',
		},
	},
	emit: {
		click: {
			event: { ns: STRAP, name: 'add-event-list' },
			data: {
				name: 'click',
				start: 0,
				events: [
					{ start: 0, name: 'ev010' },
					{ start: 1000, name: 'ev011' },
					{ start: 2000, name: 'ev014' },
				],
			},
		},
	},
	listen: [
		{ event: 'go', action: 'enter' },
		{ event: 'ev012', action: 'step01' },
		{ event: 'ev014', action: 'step02' },
		{ event: 'end-rescale-image', action: 'end-rescale-image' },
	],
	actions: [
		{
			name: 'end-rescale-image',
			dynStyle: {
				outline: '20px solid red',
			},
		},
		{
			name: 'enter',
			move: { layer: 'grid-01', slot: 'grid-01_s03' },
			dimensions: { width: '100%', height: '100%' },
			transition: { to: 'fadeIn' },
			// style: { opacity: 0.5 }
		},
		{
			name: 'step01',
			move: { layer: 'fond', slot: 'fond_s01', rescale: true },
			transition: {
				to: { opacity: 0.5 },
				// oncomplete: { event: { ns: DEFAULT_NS, name: 'leave-sprite' } },
			},
		},
		{
			name: 'step02',
			move: { layer: 'grid-01', slot: 'grid-01_s02', rescale: true },
			transition: { to: { opacity: 1 } },
		},
	],
};

export const imageSample2 = {
	id: 'image2',
	nature: 'img',
	initial: {
		content: './ikono/perfume_002.jpg',
		fit: 'cover', //"cover"
		statStyle: {
			position: 'absolute',
		},
	},
	listen: [
		{ event: 'go', action: 'enter' },
		{ event: 'ev011', action: 'step01' },
		{ event: 'ev013', action: 'step02' },
		// { event: "leave-sprite", action: "step02" },
		{ event: 'end-rescale-image2', action: 'end-rescale-image2' },
	],
	actions: [
		{
			name: 'end-rescale-image2',
			dynStyle: {
				outline: '20px solid blue',
			},
		},
		{
			name: 'enter',
			move: { layer: 'grid-01', slot: 'grid-01_s02' },
			dimensions: { width: '100%', height: '100%' },
			transition: { to: 'fadeIn' },
			// style: { opacity: 0.5 }
		},
		{
			name: 'step01',
			move: { layer: 'grid-01', slot: 'grid-01_s01', rescale: true },
			transition: { to: { opacity: 0.5 } },
		},
		{
			name: 'step02',
			move: { layer: 'fond', slot: 'fond_s01', rescale: true },
			transition: { to: { opacity: 1 } },
		},
	],
};

export const togglePlay = {
	id: 'togglePlay',
	nature: 'button',
	initial: {
		statStyle: {
			color: 'white',
			backgroundColor: 'blue',
			borderRadius: '4px',
			fontWeight: 'bold',
			fontSize: '12px',
			padding: '1rem',
			textTransform: 'uppercase',
			textAlign: 'center',
		},
		// dimensions: { width: 80, ratio: 1 },
		content: 'pause',
	},

	listen: [
		{ event: 'go', action: 'enter' },
		{ ns: TC, event: 'play', action: 'play' },
		{ ns: TC, event: 'pause', action: 'pause' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'grid-01', slot: 'grid-01_s05' },
		},
		{
			name: 'play',
			content: 'pause',
		},
		{
			name: 'pause',
			content: 'play',
		},
	],

	emit: {
		click: {
			event: { ns: STRAP, name: TOGGLE },
			data: {
				id: 'telco',
				ns: TC,
				valueA: PAUSE,
				valueB: PLAY,
			},
		},
	},
};

export const spriteSample = {
	id: 'sprite',
	nature: 'sprite',
	initial: {
		content: './ikono/Mystery-80.png',
		dimensions: { height: 300 },
		statStyle: { opacity: 0 },
	},
	listen: [
		{ event: 'ev011', action: 'enter' },
		{ event: 'ev013', action: 'step01' },
		{ event: 'ev015', action: 'exit' },
		{ event: 'move-sprite', action: 'idle' },
		{ event: 'leave-sprite', action: 'leave' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'grid-01', slot: 'grid-01_s03' },
			transition: { to: { opacity: 1, x: -100, y: 10 } },
		},
		{
			name: 'step01',
			move: { layer: 'grid-01', slot: 'grid-01_s01' },
			transition: { to: { x: 100, y: 50, rotate: 15 } },
		},
		{
			name: 'exit',
			exit: true,
			transition: { to: 'fadeOut' },
		},
		{
			name: 'idle',
		},
		{
			name: 'leave',
			leave: true,
		},
	],
	emit: {
		mousedown: {
			event: { ns: STRAP, name: 'move' },
			data: { id: 'sprite', event: 'move-sprite' },
		},
	},
};
