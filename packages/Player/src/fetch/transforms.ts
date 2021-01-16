import { nanoid } from 'nanoid';
import {
	CONTAINER_ESO,
	DEFAULT_NS,
	DEFAULT_TRANSITION_IN,
} from '../data/constantes';
import { pipe } from '../shared/utils';
import { SceneEntry, StoryEntry } from '../../../types/Entries-types';
import { transformEventimes } from './transform-eventimes';
import { transformPersos } from './transform-persos';

export function transforms(yamlStories: SceneEntry) {
	// console.log('yaml res:', JSON.stringify(yamlStories, null, 4));
	const scene = pipe(
		// transformEventimes,
		transformPersos,
		transformStories,
		transformScene
	)(yamlStories);

	// console.log('scene', scene);
	return scene;
}

function transformScene(s: SceneEntry) {
	const cast = sceneExpandCast(s);
	const entry = s.stories.find((story) => story.id === s.scene.entry);
	entry.isTemplate = true;
	const stories = cast.map((_cast) => {
		const story = s.stories.find((_story) => _story.id === _cast.id);
		const res = addStartAndEndEvents(story, _cast);
		return res;
	});
	return { ...s, scene: { ...s.scene, cast }, stories: [entry, ...stories] };
}

//TODO typeof _cast === 'string'
function sceneExpandCast(s: SceneEntry) {
	if (!s.scene.cast) return [];
	const cast = [];
	for (const _story of s.scene.cast) {
		const id = Object.keys(_story)[0];
		cast.push({ id, ..._story[id] });
	}
	return cast;
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
	return { ...story, eventimes, persos };
}

function transformStories(s: SceneEntry) {
	const stories = s.stories.map(
		pipe(setIdAndChannel, transformEventimes, transformPersos)
	);
	return { ...s, stories };
}

function setIdAndChannel(s: StoryEntry) {
	const story = s;
	story.root = CONTAINER_ESO;
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
