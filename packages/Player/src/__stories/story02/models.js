import { Slot } from '../../composants/slot';

import { joinId } from '../../shared/utils';
import { STRAP, DEFAULT_NS } from '../../data/constantes';

/// ============================================================
// Modèles
/// ============================================================

const targetsDragConfigActions = (id) => {
	const layer = 'presentoir';
	return {
		_start: () => ({
			event: [DEFAULT_NS, joinId('moveCard', id)],
		}),
		_win: ({ targetLetter, index }) => () => {
			const slot = joinId(layer, targetLetter);
			return [
				{
					event: [DEFAULT_NS, joinId('winCard', id)],
					data: {
						move: { layer: '', slot },
						style: {
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
			event: [DEFAULT_NS, joinId('idle', id)],
			data: {
				transition: {
					to: { scale: 1 },
				},
			},
		}),
		default: (d) => ({
			event: [DEFAULT_NS, joinId('dropCard', id)],
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
	};
};

const casseModel = (letter, index) => {
	const layer = 'presentoir';
	const target = 'casse';
	const id = joinId(target, index, letter);
	const uuid = joinId(layer, id);
	const slot = new Slot(uuid);
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
				move: { layer, slot: joinId(layer, 's01') },
				transition: { to: 'fadeIn', duration: 1000 },
			},
			{
				name: 'mouseenter',
				className: '+=casse-canhover',
				style: { borderRadius: '50%' },
			},
			{
				name: 'mouseleave',
				className: '-=casse-canhover',
				style: {
					borderRadius: 0,
				},
			},
			{ name: 'drop' },
		],
	};
};

const cardModel = (letter, i) => {
	const target = 'casse';
	const point = '.';
	const layer = 'sabot';
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
				style: {
					backgroundColor: '#00FF00',
					scale: 1.2,
				},
			},
			{
				name: 'dropCard',
				style: {
					backgroundColor: null,
					scale: 1,
				},
			},

			{
				name: 'enter',
				move: { layer, slot: joinId(layer, 's01') },
				transition: { to: 'fadeIn' },
			},
			{
				name: 'win',
				style: {
					backgroundColor: 'purple',
				},
			},
			{ name: 'idle' },
			{
				name: 'card-auto-move',
				style: {
					backgroundColor: 'cyan',
				},
				move: { layer: '', slot: joinId(target, index, point) },
			},
		],

		emit: {
			pointerdown: {
				event: { channel: STRAP, name: 'game-turnDrag' },
				data: {
					id,
					event: joinId('moveCard', id),
					targetActions: targetsDragConfigActions(id),
					letter,
					index,
				},
			},
		},
	};
};

export const models = { casseModel, cardModel };
