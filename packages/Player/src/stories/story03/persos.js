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
		content: 's01',
	},
	listen: [
		{ event: 'ev011', action: 'ev11' },
		// { event: 'ev013', action: 'ev0' },
		// { event: 'leave-root', action: 'leave' },
	],
	actions: [
		// { name: 'ev0', transition: { to: { x: 50 } } },
		{ name: 'ev11', className: '-=layer-top /=toptip container' },
		// { name: 'leave', transition: { to: 'fadeOut' } },
	],
};

export const textSample = {
	id: 'text-sample',
	nature: 'bloc',
	initial: {
		className: 'bloc-center',
		statStyle: {
			color: 'white',
			fontWeight: 'bold',
			padding: 24,
			borderRadius: 16,
			gridArea: '1/1',
			margin: 'auto',
		},
		content: 'dimanche',
	},
	listen: [
		{ event: 'ev011', action: 'enter' },
		{ event: 'ev012', action: 'step02' },
		{ event: 'ev013', action: 'step03' },
		{ event: 'ev014', action: 'step04' },
		{ event: 'ev015', action: 'step05' },
	],
	actions: [
		{
			name: 'enter',
			move: { slot: 's01' },
			transition: { to: 'fadeIn' },
			statStyle: {
				fontSize: 100,
				backgroundColor: '#49b6b6cf',
				// x: 200,
				// y: 100,
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
		// {
		// 	name: 'step04',
		// 	content: {
		// 		ref: 'txt02',
		// 	},
		// },
		{
			name: 'step04',
			content: {
				text: 'A bientot pour un prochain essai',
				effect: 'fade',
			},
		},
		{
			name: 'step05',
			content: {
				text: 'c’est fini',
				effect: 'letters-top-down',
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
			zIndex: -1,
		},
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { slot: 's01' },
			dimensions: { width: '100%', height: '100%' },
			transition: { to: 'fadeIn' },
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
			gridArea: '1/1',
		},
		dimensions: { width: 200, ratio: 1.5 },
		content: 'pause',
	},

	listen: [
		{ event: 'go', action: 'enter' },
		{ channel: TC, event: 'play', action: 'play' },
		{ channel: TC, event: 'pause', action: 'pause' },
	],
	actions: [
		{
			name: 'enter',
			move: { slot: 's01' },
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
			event: { channel: STRAP, name: TOGGLE },
			data: {
				id: 'telco',
				channel: TC,
				valueA: PAUSE,
				valueB: PLAY,
			},
		},
	},
};
