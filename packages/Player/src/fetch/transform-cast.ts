import { pipe } from '../shared/utils';

import { START_SCENE, MAIN } from '../data/constantes';
import { SceneAllIds } from './transform-scene';
import { Cast, Story, CastEntry } from '../../../types/Entries-types';

export function setCast(scene: SceneAllIds, _stories: Story[]) {
	const _cast = scene.cast || sceneCreateCast(_stories);
	const cast = pipe(
		resolveRootId(scene.allIds),
		addSceneEntry(scene.entry, _stories),
		sceneExpandCast
	)(_cast);

	return cast;
}

export function sceneExpandCast(_cast: CastEntry[]): Cast[] {
	if (!_cast) return [];
	const _stories = _cast.map((_story: CastEntry) =>
		typeof _story === 'string' ? _story : Object.keys(_story)[0]
	);
	const cast = _cast.map((_story: CastEntry, i: number) => {
		const id = _stories[i];
		const c =
			typeof _story === 'string'
				? {
						startAt: i === 0 ? 0 : `end-${_stories[i - 1]}`,
						root: MAIN,
				  }
				: _story[id];
		return { id, ...c };
	});
	return cast;
}

export function sceneCreateCast(stories: Story[]) {
	const _cast = stories.map((_story) => _story.id);
	return _cast;
}

// entry traité, pas les autres
function resolveRootId(allIds) {
	return function (_cast: CastEntry[]) {
		const cast = _cast.map((c) => {
			if (typeof c === 'string') return c;
			const storyId = Object.keys(c)[0];
			const root = allIds.findId(c[storyId].root, storyId);
			return { [storyId]: { ...c[storyId], root } };
		});
		return cast;
	};
}

function addSceneEntry(entry: string, _stories: Story[]) {
	return function (cast: CastEntry[]) {
		if (!entry) {
			console.warn("Pas d'entrée déclarée dans la scene");
			return cast;
		}
		const root = _stories.find((s) => s.id === entry).entry;
		const castEntry: CastEntry = {
			[entry]: {
				root,
				startAt: START_SCENE,
				isEntry: true,
			},
		};
		return [castEntry, ...cast];
	};
}
