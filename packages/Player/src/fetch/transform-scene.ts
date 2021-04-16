import { nanoid } from 'nanoid';

import { pipe, joinId, toArray } from '../shared/utils';

import {
	CONTAINER_ESO,
	DEFAULT_NS,
	DEFAULT_SCENE_STAGE,
	DEFAULT_TRANSITION_IN,
	SCENE_STAGE,
} from '../data/constantes';

import {
	Cast,
	StageEntry,
	Story,
	StoryEntry,
	SceneCastEntry,
} from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';

export function getEntry(_entry: string) {
	return function getStoryFromEntry(stories: Story[]): Story {
		// +protos
		const entry = stories.find((story) => story.id === _entry);
		if (!entry) {
			console.warn('Il n’y a pas de point d’entrée pour cette scène');
			return null;
		}
		entry.isEntry = true;
		entry.root = CONTAINER_ESO;
		return entry;
	};
}

export function getStories(cast: Cast[]) {
	return function getStoriesFromCast(stories: Story[]): Story[] {
		return cast.map((_cast) => {
			// +protos
			const _story = stories.find((s) => s.id === _cast.id);
			const story = addStartAndEndEvents(_story, _cast);
			return story;
		});
	};
}

export function preStory(stories) {
	return stories.map(pipe(setIdAndChannel, setStage));
}

function addStartAndEndEvents(story, cast) {
	const { events, ...firstEvent } = story.eventimes;
	const initEvent = {
		startAt: cast.startAt,
		channel: DEFAULT_NS,
	};
	const eventsAdded = Array.isArray(events)
		? events.concat([firstEvent])
		: [firstEvent];
	const eventimes = {
		...initEvent,
		events: eventsAdded,
	};
	eventimes.startAt = cast.startAt;
	eventimes.channel = DEFAULT_NS;
	if (!story.entry) return { ...story, eventimes };
	const persos = addEventsToEntry(story, cast);
	return { ...story, root: cast.root, eventimes, persos };
}

function addEventsToEntry(story: Story, cast: Cast) {
	const { entry } = story;

	const enterEvent = createActionListen({
		name: 'enter',
		event: cast.startAt,
		channel: DEFAULT_NS,
		action: {
			move: { slot: cast.root },
			transition: { to: DEFAULT_TRANSITION_IN },
		},
	});

	const persos = toArray(entry).reduce((_persos: Perso[], ety: string) => {
		const index = _persos.findIndex((p) => p.id === ety);
		if (index === -1) return _persos;

		// Scene entry ne doit pas se voir ajouter une action "enter"
		// car c'est fait directement
		if (cast.isEntry && _persos[index].id === cast.root) return _persos;

		const perso = addEventToPerso(enterEvent, _persos[index]);
		const res = [..._persos];
		res.splice(index, 1, perso);
		return res;
	}, story.persos);
	return persos;
}

function createActionListen({ name, event, channel, action }) {
	return {
		actions: { name, ...action },
		listen: { event, action: name, channel },
	};
}

function addEventToPerso(event, perso) {
	const listen = addListen(event.listen, perso.listen);
	const actions = addAction(event.actions, perso.actions);
	return { ...perso, listen, actions };
}

function addListen(event, _listen) {
	if (!_listen) return event;
	const hasAction = _listen.findIndex((l) => l.action === event.action);
	if (hasAction > -1) {
		const res = [..._listen];
		res.splice(hasAction, 1, event);
		return res;
	} else return _listen.concat(event);
}

function addAction(_event, _actions) {
	if (!_actions) return _event;
	const { name, ...event } = _event;
	const hasName = _actions.findIndex((a) => a.name === name);
	if (hasName > -1) {
		const action = { ...event, ..._actions[hasName] };
		const res = [..._actions];
		res.splice(hasName, 1, action);
		return res;
	} else return _actions.concat(_event);
}

function setIdAndChannel(_story: StoryEntry) {
	const story = _story;
	if (!story.id && !story.channel) {
		const id = nanoid(8);
		story.id = id;
		story.channel = id;
		console.warn('La story n’est pas identifiée ; création d’un id : %s', id);
		return story;
	}
	if (!story.id) story.id = story.channel;
	if (!story.channel) story.channel = story.id;
	return story;
}

export function setStage(_story: Story) {
	let stage: StageEntry;
	switch (typeof _story.stage) {
		case 'string':
			const name = (_story.stage as unknown) as string;
			stage = SCENE_STAGE[name] || DEFAULT_SCENE_STAGE;
			break;
		case 'object':
			stage = _story.stage as StageEntry;
			break;
		default:
			stage = DEFAULT_SCENE_STAGE;
	}
	return { ..._story, ...(stage && { stage }) };
}

export function addEntryInStory(stories: Story[], entryId: string) {
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

export function setUniqueIds(allIds: AllIds) {
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
						} else if (typeof action.move === 'object') {
							const move = allIds.findId(
								action.move.slot,
								action.move.story || story.id
							);
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
				console.log('expandStoryEntry', entry, story.entry);

				return { ...story, entry };
			}
		}
		return stories;
	};
}

export type SceneAllIds = SceneCastEntry & { allIds: AllIds };

export function tagAllIds(scene: SceneCastEntry): SceneAllIds {
	const allIds = new AllIds(scene);
	return { ...scene, allIds };
}

class AllIds {
	ids = {};
	entryId = null;
	constructor(scene) {
		if (!scene.stories) return;

		scene.stories.forEach((story) => {
			const allPersoIds = story.persos.map((perso) => perso.id);
			this.ids[story.id] = new Set(allPersoIds);
		});
		this.entryId = scene.stories.find((story: Story) => story.isSceneEntry).id;
	}
	findId(_persoId: string | string[], storyId: string) {
		const persoIds: string[] = toArray(_persoId);

		const storiesId: Set<string> = new Set([
			storyId,
			this.entryId,
			...Object.keys(this.ids),
		]);

		const idPerso: string[] = [];
		for (const sId of storiesId.keys()) {
			persoIds.forEach(
				(persoId) =>
					this.ids[sId].has(persoId) && idPerso.push(joinId(sId, persoId))
			);
		}
		// console.log('findId', _persoId, idPerso, this.ids);

		switch (idPerso.length) {
			case 0:
				return _persoId;
			case 1:
				return idPerso[0];
			default:
				return idPerso;
		}
	}
}
