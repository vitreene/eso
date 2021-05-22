import { interpolate } from 'shifty';

import { selectTransition } from '../../../Veso/src/transitions/select-transition';
import { fromTo } from '../../../Veso/src/transitions/from-to';
import { toArray } from '../shared/utils.js';

import { DEFAULT_DURATION, DEFAULT_STYLES } from '../data/constantes';

import { TimeLiner } from './runtime/timeline';
import { Story, ScenePersos, Eso } from '../../../types/Entries-types';
import {
	EsoAction,
	EsoEvent,
	EsoMove,
	EsoTansition,
	Style,
} from '../../../types/initial';

interface Transition {
	transition: EsoTansition;
	end: number;
	start: number;
	duration: number;
	from: Style;
	times: { time: number; progress: number }[];
}
interface Move {
	move: EsoMove;
	end: number;
	start: number;
	duration: number;
	times: { time: number; progress: number }[];
}

export function buildTimeLine(
	stories: Story[],
	timeLine: TimeLiner,
	esoPersos: ScenePersos
) {
	const eventsToTime = timeLine.solved;
	const persos = stories.flatMap((story) => story.persos);

	const snapshots = new Map();

	persos
		.filter((perso) => perso.nature !== 'sound')
		.forEach((perso) => {
			const esoPerso = esoPersos.get(perso.id);

			console.log(perso.id, esoPerso);

			const snaps: { [t: number]: Partial<EsoAction> } = {};

			const moves: Move[] = [];
			const transitions: Transition[] = [];

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
				snaps[time] = { ...action, ...prec };
			}

			// move - transitions
			for (const [time, listen] of times.entries()) {
				const { move: moveAction, transition: transitionAction } =
					perso.actions.find((action) => action.name === listen.action);

				if (moveAction) {
					const _move =
						typeof moveAction === 'string' ? { slot: moveAction } : moveAction;
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
							from: {},
							start,
							end,
							duration,
							times,
						});
					});
				}
			}

			// moves.sort((a,b)=> b.start - a.start)
			// transitions.sort((a,b)=> b.start - a.start)

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

			// ajouter les fractions de transitions

			let from = {
				// ...esoPerso.to,
				...perso.initial.classStyle,
				...perso.initial.style,
			};
			console.log('fractions', perso.id, from);

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
						const inter = interpolate(ft.from, ft.to, t.progress);
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

				transition.from = from;
				transition.transition.from = from;
			});

			// console.log(perso.id, moves);
			// console.log(perso.id, transitions);

			// ajouter move et transitions aux snaps
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

			for (const transition of transitions) {
				for (const t of transition.times) {
					if (t.time in snaps) {
						snaps[t.time].transition = {
							...transition.transition,
							progress: t.progress,
						};
					} else {
						snaps[t.time] = {
							...snaps[transition.start],
							transition: { ...transition.transition, progress: t.progress },
						};
					}
				}
			}

			snapshots.set(perso.id, snaps);
		});

	// console.log('buildTimeLine', eventsToTime, persos);
	console.log('SNaPSHOTS', snapshots.get('story01.bl-01'));
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
		}
	}
	return { ...update, ...look };
}
