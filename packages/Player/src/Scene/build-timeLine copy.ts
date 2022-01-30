import { interpolate } from 'shifty';

import { toArray } from '../shared/utils.js';
import { fromTo } from '../../../Veso/src/transitions/from-to';
import { selectTransition } from '../../../Veso/src/transitions/select-transition';

import { DEFAULT_DURATION } from '../data/constantes';

import {
	Style,
	EsoMove,
	EsoEvent,
	EsoAction,
	EsoTansition,
} from '../../../types/initial';
import { TimeLiner } from './runtime/timeline';
import { Story, ScenePersos, Cast } from '../../../types/Entries-types';

interface Transition {
	transition: EsoTansition;
	end: number;
	start: number;
	duration: number;
	// from: Style;
	times: { time: number; progress: number }[];
}
interface Move {
	move: EsoMove;
	end: number;
	start: number;
	duration: number;
	times: { time: number; progress: number }[];
}

export type SnapAction = Partial<EsoAction> & {
	action: string;
	channel: string;
};

export interface Snap {
	[t: number]: SnapAction;
	onScene?: {
		entry?: boolean;
		enter: number | null;
		exit: number | null;
	};
}

interface Build {
	cast: Cast[];
	stories: Story[];
	timeLine: TimeLiner;
	esoPersos: ScenePersos;
}

export type Snapshots = Map<
	{ id: string; storyId: string; entry?: boolean },
	Snap
>;

export function buildTimeLine({
	cast,
	stories,
	timeLine,
	esoPersos,
}: Build): Snapshots {
	const snapshots: Snapshots = new Map();
	const eventsToTime = timeLine.solved;

	stories.forEach((story) => {
		story.persos
			.filter((perso) => perso.nature !== 'sound')
			.forEach((perso) => {
				// NOTE pas besoin d'entry ?
				const entry = story.entry && toArray(story.entry).includes(perso.id);
				const moves: Move[] = [];
				const transitions: Transition[] = [];
				const esoPerso = esoPersos.get(perso.id);
				const snaps: Snap = {} as Snap;

				// map found actions to time
				let times: Map<number, EsoEvent> = new Map();
				for (const listen of perso.listen) {
					const time: number[] = eventsToTime[listen.channel]?.[listen.event];
					if (!time) continue;
					time.forEach((t) => times.set(t, listen));
				}
				times = new Map([...times].sort((a, b) => a[0] - b[0]));

				// compiler les propriétés cumulatives (style, classes...)
				let prec: Partial<EsoAction> = perso.initial;
				for (const [time, listen] of times.entries()) {
					const { move, transition, ...action } = perso.actions.find(
						(action) => action.name === listen.action
					);
					prec = updateLook(prec, action);
					const _listen = { channel: listen.channel, action: listen.action };

					entry && !snaps[0] && (snaps[0] = { ...prec, ..._listen });

					!snaps[0] && (snaps[0] = { ...action, ...prec, ..._listen });
					snaps[time] = { ...action, ...prec, ..._listen };
				}

				if (entry) {
					!snaps[0] && (snaps[0] = { ...prec, channel: '', action: '' });
				}

				// move - transitions
				for (const [time, listen] of times.entries()) {
					const { move: moveAction, transition: transitionAction } =
						perso.actions.find((action) => action.name === listen.action);

					if (moveAction) {
						const _move =
							typeof moveAction === 'string'
								? { slot: moveAction }
								: moveAction;
						const duration = _move.duration || DEFAULT_DURATION;
						const move = { ..._move, duration };
						const start = Number(time);
						const end = start + duration;
						const times = [
							{ time: start, progress: 0 },
							{ time: end, progress: 1 },
						];
						moves.push({ move, start, end, duration, times });
					}
					if (transitionAction) {
						toArray(transitionAction).forEach((_transition) => {
							const transition = selectTransition(_transition);
							const duration = transition.duration;
							const start = Number(time);
							const end = start + duration;
							const times = [
								{ time: start, progress: 0 },
								{ time: end, progress: 1 },
							];
							transitions.push({
								transition,
								start,
								end,
								duration,
								times,
							});
						});
					}
				}

				// ajouter les fractions de move
				moves.forEach((move) => {
					[move.start, move.end].forEach((time) => {
						const fractions = transitions.filter(
							(transition) => time > transition.start && time < transition.end
						);
						fractions.forEach((t) => {
							const progress = (time - t.start) / t.duration;
							t.times.push({ time, progress });
						});
					});
				});

				//////////////
				// ajouter les fractions de transitions
				//////////////

				let from = {
					...perso.initial.classStyle,
					...perso.initial.style,
				};

				// ajouts time et progress
				transitions.forEach((transition) => {
					[transition.start, transition.end].forEach((time) => {
						const fractions = transitions.filter(
							(_transition) =>
								!Object.is(transition, _transition) &&
								time > _transition.start &&
								time < _transition.end
						);
						fractions.forEach((t) => {
							const progress = (time - t.start) / t.duration;
							t.times.push({ time, progress });
						});
					});

					// chercher la dernière transition achevée ?
					const ended = transitions
						.filter((_transition) => _transition.end <= transition.start)
						.map((_transition) => _transition.transition.to as Style)
						.reduce((p, c) => ({ ...p, ...c }), {});

					// chercher les transitions qui ont démarré avant celle-ci et qui ne sont pas finies,
					// prendre leur état au moment ou la transition courante commence
					// pour l'ajouter a from
					const between = transitions
						.filter(
							(_transition) =>
								!Object.is(transition, _transition) &&
								_transition.start <= transition.start &&
								_transition.end > transition.start
						)
						.map((_transition) => {
							const t = _transition.times.find(
								(t) => t.time === transition.start
							);
							if (!t) return;
							const ft = fromTo(_transition.transition, {
								from: { ...from, ...ended },
								to: esoPerso.to,
								id: perso.id,
							});
							const inter = ft
								? interpolate(ft.from, ft.to, t.progress)
								: undefined;
							return inter;
						})
						.reduce((p, c) => ({ ...p, ...c }), {});

					const snap = snaps[transition.start];
					from = {
						...from,
						...snap.classStyle,
						...snap.style,
						...between,
					};
					transition.transition.from = from;
				});

				// ajouter move aux snaps
				for (const move of moves) {
					for (const t of move.times) {
						if (t.time in snaps) {
							snaps[t.time].move = { ...move.move, progress: t.progress };
						} else {
							snaps[t.time] = {
								...snaps[move.start],
								move: { ...move.move, progress: t.progress },
							};
						}
					}
				}

				// ajouter transitions aux snaps
				for (const transition of transitions) {
					for (const t of transition.times) {
						if (t.time in snaps) {
							toArray(snaps[t.time].transition).push({
								...transition.transition,
								progress: t.progress,
							});
						} else {
							snaps[t.time] = {
								...snaps[transition.start],
								transition: [
									{ ...transition.transition, progress: t.progress },
								],
							};
						}
					}
				}
				let lastMove = null;
				// propager move dans les états
				for (const time in snaps) {
					if ('move' in snaps[time]) {
						lastMove = snaps[time].move;
					} else {
						lastMove && (snaps[time].move = lastMove);
					}
				}

				// ajouter "enter": true à la première apparition de "move"
				// trouver exit s'il existe
				let enter: number = null;
				let exit: number = null;

				for (const time in snaps) {
					if ('move' in snaps[time] && !enter) {
						snaps[time].enter = true;
						enter = Number(time);
					}
					if ('exit' in snaps[time]) exit = Number(time);
				}
				if (entry) {
					snaps[0].enter = true;
					enter = 0;
				}
				snaps.onScene = { enter, exit, ...(entry && { entry }) };

				snapshots.set({ id: perso.id, storyId: story.id }, snaps);
			});
	});
	console.log('snapshots', snapshots);

	return snapshots;
}

function updateLook(_look: Partial<EsoAction>, update: Partial<EsoAction>) {
	const look = {};
	for (const up in _look) {
		switch (up) {
			case 'attr':
			case 'style':
			case 'classStyle':
				look[up] = { ..._look[up], ...update[up] };
				break;
			case 'className':
				look[up] = _look[up] + (update[up] ? ' ' + update[up] : '');
				break;
			default:
			// look[up] = _look[up]
		}
	}
	return { ..._look, ...update, ...look };
}
