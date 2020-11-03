/* 
TODO simplifier :
- toutes les actions non listées dans listen sont ajoutées avec leur propre nom
ex: { event: 'drop', action: 'drop' },
- les events sans actions ont une action vide ex. { name: 'drop' }

*/

import { STRAP, CONTAINER_ESO, DEFAULT_NS } from '../../data/constantes';

export const casualEventimes = {
	name: 'start',
	start: 0,
	events: [
		{ start: 100, name: 'go' },
		// { start: 500, name: 'initCard' },
		{ start: 500, name: 'enter-play-game' },
	],
};

const casse = {
	id: 'casse',
	nature: 'bloc',
	initial: {
		dimensions: {
			height: 200,
			width: 140,
		},
		className: 'casse',
		content: '.',
	},
	listen: [
		{ event: 'initCard', action: 'enter' },
		{ event: 'enter', action: 'mouseenter' },
		{ event: 'leave', action: 'mouseleave' },
		{ event: 'drop', action: 'drop' },
		{ event: 'hover', action: 'mouseenter' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'presentoir', slot: 'presentoir_s01' },
			transition: { to: 'fadeIn', duration: 1000 },
		},
		{
			name: 'mouseenter',
			className: '+=casse-canhover',
			dynStyle: { borderRadius: '50%' },
		},
		{
			name: 'mouseleave',
			className: '-=casse-canhover',
			dynStyle: {
				borderRadius: 0,
			},
		},
		{ name: 'drop' },
	],
};

const playGame = {
	id: 'play-game',
	nature: 'button',
	initial: {
		className: 'button-play',
		content: 'Jouer',
	},
	listen: [
		{ event: 'enter-play-game', action: 'enter' },
		{ event: 'initCard', action: 'exit' },
		{ event: 'leave-play-game', action: 'leave' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'plateau', slot: 'plateau_s01' },
			transition: { to: 'fadeIn' },
		},
		{
			name: 'exit',
			transition: { to: 'fadeOutScaleOut' },
			exit: true,
		},
		{
			name: 'leave',
			leave: true,
		},
	],
	emit: {
		click: {
			event: { ns: DEFAULT_NS, name: 'initCard' },
		},
	},
};
const card = {
	id: 'card',
	nature: 'bloc',
	initial: {
		dimensions: {
			width: 130,
			ratio: 3 / 4,
		},
		className: 'card',
		content: 'CARD',
	},
	listen: [
		{ event: 'initCard', action: 'enter' },
		{ event: 'moveCard', action: 'moveCard' },
		{ event: 'dropCard', action: 'dropCard' },
		{ event: 'winCard', action: 'win' },
		{ event: 'idle', action: 'idle' },
	],
	actions: [
		{
			name: 'moveCard',
			dynStyle: {
				backgroundColor: '#00FF00',
				scale: 1.2,
			},
		},
		{
			name: 'dropCard',
			dynStyle: {
				backgroundColor: null,
				scale: 1,
			},
		},

		{
			name: 'enter',
			move: { layer: 'sabot', slot: 'sabot_s01' },
			transition: { to: 'fadeIn' },
		},
		{
			name: 'win',
			dynStyle: {
				backgroundColor: 'purple',
			},
		},
		{ name: 'idle' },
	],

	emit: {
		pointerdown: {
			// event: { ns: STRAP, name: 'drag' },
			event: { ns: STRAP, name: 'game-turnDrag' },
			data: { id: 'card', event: 'moveCard' },
		},
	},
};

// ============================================================
// LAYERS
// ============================================================
const root = {
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
				},
			},
		],
	},
	// listen: [{ event: "init", action: "enter" }],
};

const casual = {
	id: 'casual',
	nature: 'layer',
	initial: {
		style: { background: '#ff00ee' },
		className: 'casual',
		content: [
			{ id: 's01', statStyle: { gridRow: 1 } },
			{ id: 's02', statStyle: { gridRow: 2 } },
			{ id: 's03', statStyle: { gridRow: 3 } },
			{ id: 's04', statStyle: { gridRow: 4 } },
		],
	},
	listen: [{ event: 'start', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
			order: 1,
		},
	],
};

const plateau = {
	id: 'plateau',
	nature: 'layer',
	initial: {
		className: 'plateau',
		content: [
			{
				id: 's01',
				className: 'plateau-slot',
				statStyle: { justifyContent: 'center', alignItems: 'center' },
			},
		],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s03' },
			order: 1,
		},
	],
};

const presentoir = {
	id: 'presentoir',
	nature: 'layer',
	initial: {
		dimensions: {
			width: '80%',
		},
		className: 'presentoir',
		content: [{ id: 's01' }],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s02' },
			order: 1,
		},
	],
};

const sabot = {
	id: 'sabot',
	nature: 'layer',
	initial: {
		dimensions: { width: '80%' },
		className: 'sabot',
		content: [{ id: 's01', statStyle: { gridRow: 1 } }],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s04' },
			order: 1,
		},
	],
};

const infos = {
	id: 'infos',
	nature: 'bloc',
	initial: {
		dimensions: {
			width: '80%',
		},
		className: 'infos h1',
		content: 'Devinez le mot !',
	},
	listen: [
		{ event: 'go', action: 'enter' },
		{ event: 'win', action: 'win' },
		{ event: 'lost', action: 'lost' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s01' },
			order: 1,
		},
		{
			name: 'win',
			content: 'vous avez gagné !',
		},
		{
			name: 'lost',
			content: 'vous avez perdu...',
		},
	],
};

const empty = {
	id: '',
	nature: '',
	initial: {},
	listen: [],
	actions: [],
	emit: {},
};

export const modelCasuals = [card, casse];
export const casuals = [
	root,
	casual,
	sabot,
	plateau,
	presentoir,
	infos,
	playGame,
];
