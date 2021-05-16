// import {effect} from '../../../Veso/src/presets/transition-effects-presets'
import { selectTransition } from '../../../Veso/src/transitions/select-transition';
import { toArray } from '../shared/utils.js';

import { DEFAULT_DURATION } from '../data/constantes';

import { TimeLiner } from './runtime/timeline';
import { Story, ScenePersos } from '../../../types/Entries-types';
import { EsoAction, EsoEvent, Style } from '../../../types/initial';

export function buildTimeLine(
	stories: Story[],
	timeLine: TimeLiner,
	esoPersos: ScenePersos
) {
	const eventsToTime = timeLine.solved;
	const persos = stories.flatMap((story) => story.persos);

	const snapshots = new Map();

	persos.forEach((perso) => {
		const snaps = {};
		let times: Map<number, EsoEvent> = new Map();

		// map found actions to time
		for (const listen of perso.listen) {
			const time: number[] = eventsToTime[listen.channel]?.[listen.event];
			if (!time) continue;
			time.forEach((t) => times.set(t, listen));
		}

		times = new Map([...times].sort((a, b) => a[0] - b[0]));
		let prec: Partial<EsoAction> = perso.initial;

		perso.id === 'story01.bl-01' && console.log(perso);

		for (const [time, listen] of times.entries()) {
			const { move, transition, ...action } = perso.actions.find(
				(action) => action.name === listen.action
			);
			prec = updateLook(prec, action);
			snaps[time] = { ...action, ...prec };
		}

		for (const [time, listen] of times.entries()) {
			const { move: moveAction, transition: transitionAction } =
				perso.actions.find((action) => action.name === listen.action);

			const transitions = [];

			if (transitionAction) {
				toArray(transitionAction).forEach((transition) => {
					const t = selectTransition(transition);
					const startAction = { ...t, progress: 0 };
					const endAction = { ...t, progress: 1 };
					transitions.push({ duration: t.duration, startAction, endAction });
				});

				for (const t of transitions) {
					snaps[time + t.duration] = {
						...snaps[time],
						transition: t.endAction,
					};
					snaps[time] = { ...snaps[time], transition: t.startAction };
				}
			}

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

			// fragmenter les transitions
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
