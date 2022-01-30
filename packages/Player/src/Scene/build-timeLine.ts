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
				const isEntry: boolean =
					story.entry && toArray(story.entry).includes(perso.id);
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

					isEntry && !snaps[0] && (snaps[0] = { ...prec, ..._listen });
					!snaps[0] && (snaps[0] = { ...action, ...prec, ..._listen });

					snaps[time] = { ...action, ...prec, ..._listen };
				}

				if (isEntry) {
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

						// retirer times ?
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

				for (const transition of transitions) {
					const overlaps: number[] = Array.from(times.keys()).filter(
						(time) => time > transition.start && time < transition.end
					);
					for (const time of overlaps) {
						const progress = (time - transition.start) / transition.duration;
						const _transition = toArray(snaps[time].transition);
						_transition.unshift({ ...transition, progress });
						snaps[time].transition = _transition;
					}
				}

				/* 
ne pas créer de nouvelles étapes
ajouter les transitions qui ne seraient pas terminées
si end > time et start !== time :
- calculer le progress
- ajouter la transition 
utiliser le résultat pour caculer le from de nouvelles transitions

*/

				console.log('** snaps', snaps);

				/* 
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
				 */

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
				if (isEntry) {
					snaps[0].enter = true;
					enter = 0;
				}
				snaps.onScene = { enter, exit, ...(isEntry && { entry: isEntry }) };

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

/* 

vérifier si une transition n'est pas terminée lorsque une autre action commence.
dans ce cas seulement, dupliquer la transition
pour chaque transition, construire from à partir de l'état courant
-> si un move à lieu vers un slot en mouvement, il faudra détecter ce mouvement pour calculer la position de l'objet déplacé.
 
*/
