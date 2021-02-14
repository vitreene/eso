import { nanoid } from 'nanoid';
import {
	CONTAINER_ESO,
	DEFAULT_NS,
	DEFAULT_TRANSITION_IN,
	SCENE_STAGE,
	DEFAULT_SCENE_STAGE,
} from '../data/constantes';
import { pipe } from '../shared/utils';
import {
	Cast,
	Scene,
	SceneEntry,
	Story,
	StoryEntry,
} from '../../../types/Entries-types';
import { transformEventimes } from './transform-eventimes';
import { transformPersos, postPersos } from './transform-persos';

type CastEntry = Scene['cast'];

//TODO adapter pour que la fonction accepte plusieurs scenes
export function transforms(s: SceneEntry) {
	const scene = transformScene(s);
	return scene;
}

function transformScene(s: SceneEntry) {
	const cast: Cast[] = sceneExpandCast(s.scene.cast);
	const stories: Story[] = transformStories(s.stories);
	const entry = getEntry(s.scene.entry)(stories);
	const casting = getStories(cast)(stories);

	return { ...s, scene: { ...s.scene, cast }, stories: [entry, ...casting] };
}

//TODO typeof _cast === 'string'
function sceneExpandCast(_cast: CastEntry): Cast[] {
	if (!_cast) return [];
	const cast = [];
	for (const _story of _cast) {
		const id = Object.keys(_story)[0];
		cast.push({ id, ..._story[id] });
	}
	return cast;
}

function getEntry(_entry) {
	return function getStoryFromEntry(stories: StoryEntry[]) {
		// +protos
		const entry = stories.find((story) => story.id === _entry);
		entry.isTemplate = true;
		entry.root = CONTAINER_ESO;
		return entry;
	};
}

function getStories(cast: Cast[]) {
	return function getStoriesFromCast(stories: StoryEntry[]): Story[] {
		return cast.map((_cast) => {
			// +protos
			const _story = stories.find((s) => s.id === _cast.id);
			const story = addStartAndEndEvents(_story, _cast);
			return story;
		});
	};
}

// ajouter l'event d'entrée et de sortie de la story
/**
 * entry : string | string[] // entry de la story
 * cast: {root: string, startAt; string}
 * persos: Perso[] // filtrer les persos désignés par entry
 */

// ajouter un event de sortie de scene (kill)
// ajouter play/pause

function addStartAndEndEvents(story, cast) {
	const eventimes = story.eventimes;
	eventimes.startAt = cast.startAt;
	eventimes.channel = DEFAULT_NS;
	if (!story.entry) return { ...story, eventimes };
	const persos = addEventsToEntry(story, cast);
	return { ...story, root: cast.root, eventimes, persos };
}

/* 
addEventToEntry doit ajouter une action et un listen au perso
- si l'action "enter" existe, la modifier pour modifier la prop "move"
- sinon l'ajouter
- si 'enter' existe comme action dans listen, remplacer le listen
- sinon l'ajouter

Remplacer le listen : l'action "enter" rajoutée est prioritaire car demandée par la scene. Par contre, plusieurs actions pourraient provoquer la sortie de la scène.
*/

export function addEventsToEntry(story, cast) {
	const { entry } = story;
	if (!entry) return story.persos;

	const enterEvent = createActionListen({
		name: 'enter',
		event: cast.startAt,
		channel: DEFAULT_NS,
		action: {
			move: { slot: cast.root },
			transition: { to: DEFAULT_TRANSITION_IN },
		},
	});

	const persos = (Array.isArray(entry) ? entry : [entry]).reduce(
		(_persos, entry) => {
			const index = _persos.findIndex((p) => p.id === entry);
			if (index === -1) return _persos;
			const perso = addEventToPerso(enterEvent, _persos[index]);
			const res = [..._persos];
			res.splice(index, 1, perso);
			return res;
		},
		story.persos
	);
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
	const hasAction = _listen.findIndex((l) => l.action === event.action);
	if (hasAction > -1) {
		const res = [..._listen];
		res.splice(hasAction, 1, event);
		return res;
	} else return _listen.concat(event);
}

function addAction(_event, _actions) {
	const { name, ...event } = _event;
	const hasName = _actions.findIndex((a) => a.name === name);
	if (hasName > -1) {
		const action = { ...event, ..._actions[hasName] };
		const res = [..._actions];
		res.splice(hasName, 1, action);
		return res;
	} else return _actions.concat(_event);
}

/// ============================================================
function transformStories(_stories: StoryEntry[]): Story[] {
	if (!_stories) return;
	const stories: Story[] = _stories.map(
		pipe(setIdAndChannel, setStage, transformEventimes, transformPersos)
	);

	// deepmerge inherit
	stories.forEach((story) => story.persos && postPersos(story.persos));
	stories.forEach(mergeStories);

	return stories;
}

function mergeStories(_story: Story) {
	return _story;
}

function setIdAndChannel(_story: StoryEntry) {
	const story = _story;
	// story.root = CONTAINER_ESO;
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

function setStage(_story: StoryEntry) {
	const stage =
		typeof _story.stage === 'string'
			? SCENE_STAGE[_story.stage] || DEFAULT_SCENE_STAGE['4/3']
			: _story.stage;
	return { ..._story, stage };
}
