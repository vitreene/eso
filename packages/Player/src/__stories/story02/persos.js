import { STRAP, DEFAULT_NS } from '../../data/constantes';

/// ============================================================
// PERSOS /////////////
/// ============================================================
const timer = {
	id: 'timer',
	nature: 'bloc',
	initial: {
		className: 'timer',
		content: 'Go-go',
	},
	listen: [
		{ event: 'enter-play-game', action: 'enter' },
		{ event: 'update-counter', action: 'update' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s01' },
			transition: { to: 'fadeIn' },
		},
		{ name: 'update' },
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
		click: [
			{ event: { channel: DEFAULT_NS, name: 'initCard' } },
			{ event: { channel: STRAP, name: 'game-play' } },
		],
	},
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

export const casting = [infos, timer, playGame];
