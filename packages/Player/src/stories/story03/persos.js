import {
	CONTAINER_ESO,
	STRAP,
	TC,
	PLAY,
	PAUSE,
	TOGGLE,
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
	listen: [
		{ event: 'ev013', action: 'ev0' },
		{ event: 'leave-root', action: 'leave' },
	],
	actions: [
		{ name: 'ev0', dynStyle: { x: 50 } },
		{ name: 'leave', transition: { to: 'fadeOut' } },
	],
};

export const textSample = {
	id: 'text-sample',
	nature: 'bloc',
	initial: {
		dimensions: { width: 621, height: 314 },
		className: 'totoo',
		statStyle: {
			color: 'white',
			fontWeight: 'bold',
			padding: '8px',
		},
		content: 'dimanche',
	},
	listen: [
		{ event: 'ev011', action: 'enter' },
		{ event: 'ev012', action: 'step02' },
		// { event: 'ev013', action: 'step03' },
		{ event: 'ev014', action: 'step04' },
		{ event: 'ev015', action: 'step03' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
			transition: { to: 'fadeIn' },
			statStyle: {
				fontSize: 100,
				backgroundColor: '#49b6b6cf',
				x: 200,
				y: 200,
			},
			className: 'new-text',
		},
		{
			name: 'step02',
			content: {
				lang: 'fr',
				refLang: 'sous-titre',
				ref: 'txt01',
				effect: 'fade',
			},
		},
		{
			name: 'step03',
			content: {
				lang: 'en',
				refLang: 'langue',
				ref: 'txt01',
				effect: 'fade',
			},
		},
		{
			name: 'step04',
			content: {
				text: 'A bientot',
				effect: 'fade',
			},
		},
		{
			name: 'step05',
			content: "c'est fini",
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
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
			dimensions: { width: '100%', height: '100%' },
			transition: { to: 'fadeIn' },
		},
	],
};

/* export */ const togglePlay = {
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
