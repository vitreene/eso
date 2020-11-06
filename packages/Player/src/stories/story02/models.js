import { joinId } from '../../shared/utils';
import { STRAP, DEFAULT_NS } from '../../data/constantes';

/// ============================================================
// Modèles
/// ============================================================
const target = 'presentoir';
const targetsDragConfig = (id) => ({
	_start: () => ({
		event: [DEFAULT_NS, 'moveCard_' + id],
	}),
	_win: ({ target, index }) => () => {
		const slot = joinId('presentoir', target);
		return [
			{
				event: [DEFAULT_NS, 'winCard_' + id],
				data: {
					move: { layer: '', slot },
					dynStyle: {
						color: 'yellow',
					},
					transition: {
						to: { left: 0, top: 0, scale: 1 },
					},
				},
			},

			{
				event: [STRAP, 'game-turnDrop'],
				data: { index },
			},
		];
	},
	main: () => ({
		event: [DEFAULT_NS, 'idle_' + id],
		data: {
			transition: {
				to: { scale: 1 },
			},
		},
	}),
	default: (d) => ({
		event: [DEFAULT_NS, 'dropCard_' + id],
		data: {
			transition: {
				to: {
					left: d.initialElPosition.x,
					top: d.initialElPosition.y,
					backgroundColor: 'red',
				},
			},
		},
	}),
});

const casseModel = (Slot) => (letter, index) => {
	const id = joinId('casse', index, letter);
	const uuid = joinId(target, id);
	const slot = new Slot({ uuid });
	slot(letter);

	return {
		id,
		nature: 'bloc',
		initial: {
			dimensions: {
				height: 200,
				width: 140,
			},
			className: 'casse',
			content: slot,
		},
		listen: [
			{ event: 'initCard', action: 'enter' },
			{ event: 'enter', action: 'mouseenter' },
			{ event: joinId('leave', id), action: 'mouseleave' },
			{ event: joinId('drop', id), action: 'drop' },
			{ event: joinId('hover', id), action: 'mouseenter' },
		],
		actions: [
			{
				name: 'enter',
				move: { layer: target, slot: joinId(target, 's01') },
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
};

const cardModel = (letter, i) => {
	const index = i + 1;
	const id = joinId('card', index, letter);
	return {
		id,
		nature: 'bloc',
		initial: {
			dimensions: {
				width: 130,
				ratio: 3 / 4,
			},
			className: 'card',
			content: letter,
		},
		listen: [
			{ event: 'initCard', action: 'enter' },
			{ event: joinId('moveCard', id), action: 'moveCard' },
			{ event: joinId('dropCard', id), action: 'dropCard' },
			{ event: joinId('winCard', id), action: 'win' },
			{ event: joinId('idle', id), action: 'idle' },
			{ event: joinId('card-auto-move', id), action: 'card-auto-move' },
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
			{
				name: 'card-auto-move',
				dynStyle: {
					backgroundColor: 'cyan',
				},
				move: { layer: '', slot: joinId('presentoir_casse', index, '.') },
			},
		],

		emit: {
			pointerdown: {
				event: { ns: STRAP, name: 'game-turnDrag', targetsDragConfig },
				data: { id, event: joinId('moveCard', id), letter, index },
			},
		},
	};
};

export const models = { /* targetsDragConfig, */ casseModel, cardModel };
