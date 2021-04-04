import { pipe } from '../shared/utils';
import { mergePersos } from './merge-persos';
import { mergeStories } from './merge-stories';
import { transformEventimes } from './transform-eventimes';

import {
	dispatchPersoProps,
	filterProtos,
	prePersos,
} from './transform-persos';
import {
	setStage,
	preStory,
	getEntry,
	getStories,
	sceneCreateCast,
	sceneExpandCast,
} from './transform-scene';
import { parseVariables } from './variables-template';

import {
	Cast,
	CastEntry,
	Scene,
	SceneCastEntry,
	SceneEntry,
	SharedFileEntry,
	Story,
} from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';
import { Inherit, Channel } from './fetch-chapter';
import { CONTAINER_ESO, START_SCENE } from '../data/constantes';

export function exploreFile(file: SceneEntry, inherit: Inherit) {
	const _scenes: SceneCastEntry[] = Array.isArray(file.scene)
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

/* 

rendre entry moins spécifique, c'est une story comme les autres, chargée en tout premeir dans l'app
*/

function exploreScene(scene: SceneCastEntry, inherit: Inherit): Scene {
	const sceneShared = exploreShared(scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);

	const _stories = exploreStories(scene, _inherit);

	// const entry = getEntry(scene.entry)(_stories);
	// console.log('ENTRY', entry);

	const cast: Cast[] = setCast(scene, _stories);

	const stories = getStories(cast)(_stories);
	// const casting = getStories(cast)(_stories);
	// const stories = [entry, ...casting].filter(Boolean);
	const { shared, ...__scene } = scene;
	return { ...__scene, cast, stories };
}

function exploreStories(scene: SceneCastEntry, inherit: Inherit): Story[] {
	if (!scene.stories) return;
	// const entry = findEntry(scene, inherit);
	// const entry = getEntry(scene.entry)(inherit.stories);
	const entry = inherit.stories.find((story) => story.id === scene.entry);

	let stories: Story[];
	stories = preStory(scene.stories);
	stories = stories.map(explorePersos(inherit?.persos, scene));
	stories = mergeStories(stories, inherit.stories);

	// stories = [entry, ...stories];
	entry && stories.unshift(entry);

	stories = stories.map(transformEventimes);
	stories = stories.map(setStage);
	stories = stories.map(resolveTemplateStory(scene));

	return stories;
}

function setCast(scene: SceneCastEntry, _stories: Story[]) {
	const cast = scene.cast || sceneCreateCast(_stories);

	if (scene.entry) {
		const castEntry: CastEntry = {
			[scene.entry]: {
				root: CONTAINER_ESO,
				startAt: START_SCENE,
				isEntry: true,
			},
		};
		cast.push(castEntry);
	} else {
		console.warn("Pas d'entrée déclarée dans la scene");
	}

	return sceneExpandCast(cast);
}

function findEntry(scene: SceneCastEntry, inherit: Inherit): Story {
	if (!scene.entry) {
		console.warn("Pas d'entrée déclarée dans la scene");
		return undefined;
	}
	const entry =
		// getEntry(scene.entry)(scene.stories) ||
		getEntry(scene.entry)(inherit.stories);

	// if (!entry) {
	// 	console.warn(`Pas d'entrée ${scene.entry} dans la scene ${scene.id}`);
	// 	return undefined;
	// }
	return entry;
}

function resolveTemplateStory(scene: SceneCastEntry) {
	return ({ persos, ...story }): Story => {
		const _persos = resolveTemplate({ scene, story })(persos);

		const _story = parseVariables(story, { scene, story });
		return { ...(_story as Story), persos: _persos };
	};
}

function explorePersos(inherit: Perso[], scene: SceneCastEntry = null) {
	return function explorePersosInherit(story: Story) {
		if (!story.persos) return story;
		const channel: Channel = story.channel || null;
		const persos: Perso[] = pipe(
			prePersos,
			mergePersosInherit(inherit, story.ignore),
			dispatchPersoProps(channel),
			filterProtos,
			resolveTemplate({ scene, story })
		)(story.persos);
		return { ...story, persos };
	};
}

interface Context {
	scene?: SceneCastEntry;
	story?: any;
}

function resolveTemplate(context: Context) {
	return function templatePerso(persos: Perso[]) {
		if (!context.scene) return persos;
		return persos.map(
			(perso: Perso): Perso => parseVariables(perso, { perso, ...context })
		);
	};
}
function exploreShared(_shared: SharedFileEntry, inherit: Inherit) {
	if (!_shared) return null;
	let stories: Story[] = [];
	let persos: Perso[] = [];

	if (_shared.persos) {
		persos = pipe(
			prePersos,
			mergePersosInherit(inherit.persos)
		)(_shared.persos);
	}
	if (_shared.stories) {
		stories = _shared.stories.map(
			explorePersos([...inherit?.persos, ...persos])
		);
		// FIXME stories.shared est muté ; ne pas appliquer de template ici !
		stories = mergeStories(stories, inherit.stories);
	}
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
