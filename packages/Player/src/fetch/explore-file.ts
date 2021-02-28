import { pipe } from '../shared/utils';
import { mergePersos } from './merge-persos';
import { mergeStories } from './merge-stories';
import {
	dispatchPersoProps,
	filterProtos,
	prePersos,
} from './transform-persos';
import {
	getEntry,
	getStories,
	preStory,
	sceneCreateCast,
	sceneExpandCast,
} from './transform-scene';
import { parseVariables } from './variables-template';

import {
	Cast,
	Scene,
	SceneEntry,
	SharedFileEntry,
	Story,
} from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';
import { Inherit, Channel } from './fetch-chapter';

export function exploreFile(file: SceneEntry, inherit: Inherit) {
	const _scenes: Scene[] = Array.isArray(file.scene)
		? file.scene
		: [file.scene];
	const shareds: Inherit[] = Array.isArray(file.shared)
		? file.shared
		: [file.shared];
	const _inherit = shareds.reduce((complete, shared) => {
		const _shared = exploreShared(shared, complete);
		return mergeProps(_shared, complete, ['stories', 'persos']);
	}, inherit);

	const scenes: Scene[] = _scenes.map((scene) => exploreScene(scene, _inherit));

	console.log('explore scene', scenes);
	console.log('============================================================');
	return scenes;
}
function exploreScene(scene: Scene, inherit: Inherit) {
	const sceneShared = exploreShared(scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);
	const _stories = exploreStories(scene.stories, _inherit, scene);
	const cast: Cast[] = sceneExpandCast(scene.cast) || sceneCreateCast(_stories);
	const entry = getEntry(scene.entry)(_stories);
	const casting = getStories(cast)(_stories);
	const stories = [entry, ...casting].filter(Boolean);
	const { shared, ..._scene } = scene;
	return { ..._scene, cast, stories };
}

function exploreStories(
	_stories: Story[],
	inherit: Inherit,
	scene: Scene
): Story[] {
	if (!_stories) return;
	let stories: Story[];
	stories = preStory(_stories);
	stories = stories.map(explorePersos(inherit?.persos, scene));
	stories = mergeStories(stories, inherit.stories);
	return stories;
}

function explorePersos(inherit: Perso[], scene: Scene = null) {
	return function explorePersosInherit(story: Story) {
		if (!story.persos) return story;
		const channel: Channel = story.channel || null;
		const persos: Perso[] = pipe(
			prePersos,
			dispatchPersoProps(channel),
			mergePersosInherit(inherit),
			filterProtos,
			resolveTemplate({ scene, story })
		)(story.persos);
		return { ...story, persos };
	};
}

interface Context {
	scene?: Scene;
	story?: Story;
}
function resolveTemplate(context: Context) {
	return function templatePerso(persos: Perso[]) {
		if (!context.scene) return persos;
		return persos.map(
			(perso: Perso): Perso => parseVariables(perso, { perso, ...context })
		);
	};
}
function exploreShared(_scene: SharedFileEntry, inherit: Inherit) {
	if (!_scene) return null;
	let stories: Story[];
	let persos: Perso[];
	if (_scene.persos)
		persos = pipe(prePersos, mergePersosInherit(inherit.persos))(_scene.persos);
	if (_scene.stories) {
		stories = _scene.stories.map(
			explorePersos([...inherit?.persos, ...persos])
		);
		stories = mergeStories(stories, inherit.stories);
	}
	return Object.assign(
		{},
		_scene,
		stories && stories.length && { stories },
		persos && persos.length && { persos }
	);
}

function mergePersosInherit(inherit: Perso[]) {
	return (persos: Perso[]) => mergePersos(persos, inherit);
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
