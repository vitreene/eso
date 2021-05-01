import { map, pipe, toArray } from '../shared/utils';

import { mergePersos } from './merge-persos';
import { mergeStories } from './merge-stories';
import {
	dispatchPersoProps,
	filterProtos,
	prePersos,
} from './transform-persos';
import {
	setStage,
	preStory,
	getStories,
	addEntryInStory,
	setUniqueIds,
	tagAllIds,
	SceneAllIds,
} from './transform-scene';
import { setCast } from './transform-cast';
import { transformEventimes } from './transform-eventimes';
import {
	resolveTemplateStory /* , resolveTemplate  */,
} from './transform-variables';

import {
	Cast,
	Scene,
	SceneCastEntry,
	SceneEntry,
	SharedFileEntry,
	Story,
} from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';
import { Inherit, Channel } from './fetch-chapter';

export function exploreFile(file: SceneEntry, inherit: Inherit) {
	const _scenes: SceneCastEntry[] = toArray(file.scene);
	const shareds: Inherit[] = toArray(file.shared);
	const _inherit = shareds.reduce((complete, shared) => {
		const _shared = exploreShared(shared, complete);
		return mergeProps(_shared, complete, ['stories', 'persos']);
	}, inherit);
	const scenes: Scene[] = _scenes.map((scene) => exploreScene(scene, _inherit));

	console.log('explore scene', scenes);
	console.log('============================================================');
	return scenes;
}

function exploreScene(_scene: SceneCastEntry, inherit: Inherit): Scene {
	console.log('exploreScene', _scene);

	const sceneShared = exploreShared(_scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);
	const scene = pipe(exploreMergeStories(_inherit), tagAllIds)(_scene);

	const _stories = exploreAddonsStories(scene as SceneAllIds);
	const cast: Cast[] = setCast(scene, _stories);
	const stories = getStories(cast)(_stories);

	const { shared, allIds, ...__scene } = scene;
	return { ...__scene, cast, stories };
}

function exploreMergeStories(inherit: Inherit) {
	return function (scene: SceneCastEntry): SceneCastEntry {
		if (!scene.stories) return;
		// expand scene.entry
		const stories = pipe(
			preStory,
			map(explorePersos(inherit?.persos /* , scene */)),
			mergeStories(inherit.stories),
			addEntryInStory(inherit.stories, scene.entry)
		)(scene.stories);
		return { ...scene, stories };
	};
}

function exploreAddonsStories(scene: SceneAllIds): Story[] {
	if (!scene.stories) return;
	// expand scene.entry
	const stories = pipe(
		map(transformEventimes),
		map(setStage),
		setUniqueIds(scene.allIds),
		map(resolveTemplateStory(scene))
	)(scene.stories);
	return stories;
}

// NOTE ne pas utiliser resolveTemplate ici, c'est trop tôt
function explorePersos(inherit: Perso[] /* , scene: SceneCastEntry = null */) {
	return function explorePersosInherit(story: Story) {
		if (!story.persos) return story;
		const channel: Channel = story.channel || null;
		const persos: Perso[] = pipe(
			prePersos,
			mergePersosInherit(inherit, story.ignore),
			dispatchPersoProps(channel),
			filterProtos
			// resolveTemplate({ scene, story })
		)(story.persos);
		return { ...story, persos };
	};
}

function exploreShared(_shared: SharedFileEntry, inherit: Inherit) {
	if (!_shared) return null;
	const persos: Perso[] = _shared.persos
		? pipe(prePersos, mergePersosInherit(inherit.persos))(_shared.persos)
		: [];
	const stories: Story[] = _shared.stories
		? pipe(
				map(explorePersos([...inherit?.persos, ...persos])),
				mergeStories(inherit.stories)
		  )(_shared.stories)
		: [];
	return Object.assign(
		{},
		_shared,
		stories && stories.length && { stories },
		persos && persos.length && { persos }
	);
}

function mergePersosInherit(inherit: Perso[], ignore: string[] = []) {
	return (persos: Perso[]) => mergePersos(persos, inherit, ignore);
}

// merge deux objets dont les props sont un tableau ou undefined
function mergeProps(obj1: unknown, obj2: unknown, props: string[]) {
	if (!obj1) return obj2;
	if (!obj2) return obj1;
	const res = {};
	for (const prop of props) {
		const arr1 = obj1[prop] || [];
		const arr2 = obj2[prop] || [];
		res[prop] = arr1.concat(arr2);
	}
	return res;
}
