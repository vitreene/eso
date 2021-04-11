import { map, pipe, joinId } from '../shared/utils';
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

import { START_SCENE } from '../data/constantes';

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

function exploreScene(_scene: SceneCastEntry, inherit: Inherit): Scene {
	const sceneShared = exploreShared(_scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);
	let scene;
	scene = exploreMergeStories(_scene, _inherit);
	scene = tagAllIds(scene);
	const __stories = exploreAddonsStories(scene as SceneAllIds);
	const cast: Cast[] = setCast(scene, __stories);
	const stories = getStories(cast)(__stories);
	const { shared, allIds, ...__scene } = scene;
	return { ...__scene, cast, stories };
}

function exploreMergeStories(
	scene: SceneCastEntry,
	inherit: Inherit
): SceneCastEntry {
	if (!scene.stories) return;
	// expand scene.entry
	const stories = pipe(
		preStory,
		map(explorePersos(inherit?.persos, scene)),
		mergeStories(inherit.stories),
		addEntryInStory(inherit.stories, scene.entry)
		// logs
	)(scene.stories);
	return { ...scene, stories };
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

function logs<T>(obj: T) {
	console.log('LOG', obj);
	return obj;
}

function addEntryInStory(stories: Story[], entryId: string) {
	const isSceneEntry = true;
	const mergeEntry = stories.find((story) => story.id === entryId);
	return function (stories: Story[]): Story[] {
		if (mergeEntry) return [{ ...mergeEntry, isSceneEntry }, ...stories];
		const entry = stories.find((story) => story.id === entryId);
		return entry
			? [
					{ ...entry, isSceneEntry },
					...stories.filter((story) => story.id !== entryId),
			  ]
			: stories;
	};
}

function setCast(scene: SceneAllIds, _stories: Story[]) {
	const _cast = scene.cast || sceneCreateCast(_stories);
	const cast = pipe(
		resolveRootId(scene.allIds),
		addSceneEntry(scene.entry, _stories),
		sceneExpandCast
	)(_cast);

	return cast;
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
function resolveTemplateStory(scene: SceneCastEntry) {
	return ({ persos, ...story }: Story): Story => {
		const _persos = resolveTemplate({ scene, story })(persos);

		const _story: Story = parseVariables(story, { scene, story });
		return { ..._story, persos: _persos };
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
	story?: Omit<Story, 'persos'>;
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
		stories = mergeStories(inherit.stories)(stories);
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

type SceneAllIds = SceneCastEntry & { allIds: AllIds };

function tagAllIds(scene: SceneCastEntry): SceneAllIds {
	const allIds = new AllIds(scene);
	return { ...scene, allIds };
}

class AllIds {
	ids = {};
	entryId = null;
	constructor(scene) {
		scene.stories.forEach((story) => {
			const allPersoIds = story.persos.map((perso) => perso.id);
			this.ids[story.id] = new Set(allPersoIds);
		});
		this.entryId = scene.stories.find((story) => story.isSceneEntry).id;
	}
	findId(persoId: string, storyId: string) {
		if (this.ids[storyId].has(persoId)) return joinId(storyId, persoId);
		if (this.ids[this.entryId].has(persoId))
			return joinId(this.entryId, persoId);
		return persoId;
	}
}

function setUniqueIds(allIds: AllIds) {
	return function (_stories: Story[]) {
		const stories = _stories.map((story) =>
			pipe(expandId, resolveMoveId)(story)
		);

		function expandId(story: Story) {
			const persos = story.persos.map((perso) => ({
				...perso,
				id: joinId(story.id, perso.id),
			}));
			return { ...story, persos };
		}

		function resolveMoveId(story: Story) {
			const persos = story.persos.map((perso) => {
				const actions = perso.actions.map((action) => {
					if (action.move) {
						if (typeof action.move === 'string') {
							const move = allIds.findId(action.move, story.id);
							return { ...action, move: { slot: move } };
						}
					} else return action;
				});
				return { ...perso, actions };
			});
			return { ...expandStoryEntry(story), persos };

			function expandStoryEntry(story: Story) {
				if (!story.entry) return story;
				const entry = allIds.findId(story.entry, story.id);
				return { ...story, entry };
			}
		}
		return stories;
	};
}
