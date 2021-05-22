import { interpolate } from 'shifty';

import { selectTransition } from '../../../Veso/src/transitions/select-transition';
import { toArray } from '../shared/utils.js';

import { DEFAULT_DURATION } from '../data/constantes';

import { TimeLiner } from './runtime/timeline';
import { Story, ScenePersos, Eso } from '../../../types/Entries-types';
import {
	EsoAction,
	EsoEvent,
	EsoMove,
	EsoTansition,
	Style,
} from '../../../types/initial';

export function buildTimeLine(
	stories: Story[],
	timeLine: TimeLiner,
	esoPersos: ScenePersos
) {
	const eventsToTime = timeLine.solved;
	const persos = stories.flatMap((story) => story.persos);

	const snapshots = new Map();

	persos.forEach((perso) => {
		const snaps: { [t: number]: Partial<EsoAction> } = {};
		let times: Map<number, EsoEvent> = new Map();

		// map found actions to time
		for (const listen of perso.listen) {
			const time: number[] = eventsToTime[listen.channel]?.[listen.event];
			if (!time) continue;
			time.forEach((t) => times.set(t, listen));
		}

		times = new Map([...times].sort((a, b) => a[0] - b[0]));
		let prec: Partial<EsoAction> = perso.initial;
		// compiler les propriétés cumulatives (style, classes...)
		for (const [time, listen] of times.entries()) {
			const { move, transition, ...action } = perso.actions.find(
				(action) => action.name === listen.action
			);
			prec = updateLook(prec, action);
			snaps[time] = { ...action, ...prec };
		}

		// move
		for (const [time, listen] of times.entries()) {
			const { move: moveAction, transition: transitionAction } =
				perso.actions.find((action) => action.name === listen.action);

			if (moveAction) {
				const _move =
					typeof moveAction === 'string' ? { slot: moveAction } : moveAction;
				const duration = _move.duration || DEFAULT_DURATION;
				const move = { ..._move, duration };
				snaps[time + duration]
					? (snaps[time + duration].move = { ...move, progress: 1 })
					: (snaps[time + duration] = {
							...snaps[time],
							move: { ...move, progress: 1 },
					  });

				snaps[time].move = { ...move, progress: 0 };
			}
		}

		// frogmenter les move
		const snapsMove = {};
		let currentMove = {};
		for (const time in snaps) {
			const snap = snaps[time];
			snapsMove[time] = snap;
			if ('move' in snap) {
				const move = snap.move as EsoMove;
				currentMove = { ...move, progress: 1 };
				const { duration = DEFAULT_DURATION } = move;
				const range = rangeDuration(Number(time), duration, snaps);
				range.forEach((r) => {
					if ('move' in snaps[r]) return;
					const p = move.progress || 0;
					const _progress = (r - Number(time)) / duration + p;
					const progress = _progress > 1 ? 1 : _progress;
					snapsMove[r] = { ...snaps[r], move: { ...move, progress } };
				});
			} else snapsMove[time].move = currentMove;
		}

		console.log('snapsMove', perso.id, { ...snapsMove });

		// fragmenter les transitions
		/* 
		il faut générer between pour chaque transtion pour les ajouter aux transtions 
		pur refleter le fonctionnement des transtions, elles captent l'état du composant lorsqu'elles sont créées = ( progress = 0 )


		2 passes:
		1. reporter les transitions fragmentées
		2.à chaque état :
		- séparer les transitions dont le progress est à 0 ;
		- calculer le between des autres
		- ajouter le résultat au from des premeières transtions.

		Il va falloir reporter le "from" d'une part de transition à l'autre:
		- soit il faut identifier la transition par un id,
		- soit je crée un tableau qui associe la transition à un couple time/progress, puis je renseigne le from, et map sur l'état

		transitions :
		[{
			transition,
			from,
			times: [{time:0, progress: 0},{time:500, progress: 1} ...]
		}]
		*/

		/*{

			const transitions = [];

			if (transitionAction) {
				const action = snaps[time];
				// perso.id === 'story01.bl-01' && console.log('action', action);
				const from = { ...action.classStyle, ...action.style };
				toArray(transitionAction).forEach((transition: EsoTansition) => {
					const propFrom =
						typeof transition.from === 'string'
							? transition.from
							: { ...from, ...transition.from };
					const t = selectTransition({
						...transition,
						from: propFrom,
					});
					// console.log('FROM', from, t.from);

					const startAction = { ...t, progress: 0 };
					const endAction = { ...t, progress: 1 };
					transitions.push({ duration: t.duration, startAction, endAction });
				});

				for (const t of transitions) {
					const { move, ...snap } = snaps[time];
					const endTime = time + t.duration;
					if (endTime in snaps) {
						const _transition = toArray(snaps[endTime].transition);
						_transition.push(t.endAction);
						snaps[endTime].transition = _transition;
					} else {
						snaps[endTime] = {
							...snap,
							transition: [t.endAction],
						};
					}
					snaps[time] = {
						...snaps[time],
						transition: [...toArray(snaps[time].transition), t.startAction],
					};
				}
			}
		}*/

		const snapsTrans = {};

		for (const time in snapsMove) {
			const snap = snapsMove[time];
			if ('transition' in snap) {
				!Array.isArray(snap.transition) &&
					console.log('transition', perso.id, time, snap.transition);
				/* 
					- range
					- progress
					- priorité basse

					*/
			}
		}

		snapshots.set(perso.id, snaps);
	});

	// console.log('buildTimeLine', eventsToTime, persos);
	console.log('SNPSHOTS', snapshots.get('story01.bl-01'));
}

function updateLook(_look: Partial<EsoAction>, update: EsoAction) {
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

function rangeDuration(time, duration, snaps) {
	const times = Object.keys(snaps);
	const res = times
		.filter((t) => t > time && t < time + duration)
		.map((t) => Number(t));
	// console.log('range', time, duration, res);
	return res;
}

function getBetween(transitions) {
	console.log('transitions', transitions);

	const t = toArray(transitions).map(({ from, to, progress }) => {
		const inter = interpolate(from, to, progress);
		console.log('getBetween', progress, inter);
	});
}
/* 

font-size: 16







color: "rgba(30.6708,0,30.6708,0.2427)"
font-size: 40
pointer-events: "all"


*/
