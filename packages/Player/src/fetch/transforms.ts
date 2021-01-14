import { nanoid } from 'nanoid';
import {
	CONTAINER_ESO,
	DEFAULT_NS,
	DEFAULT_TRANSITION_IN,
	MAIN,
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

		console.log(story.persos[0].id, story.entry, _cast);
		console.log('story->', story);
		console.log('res--->', res);

		return res;
	});
	return { ...s, scene: { ...s.scene, cast }, stories: [entry, ...stories] };
}

//TODO typeof _cast === 'string'
function sceneExpandCast(s: SceneEntry) {
	if (!s.scene.cast) return [];
	const cast = [];
	for (const _story of s.scene.cast) {
		// const id = typeof _cast === 'string' ? _cast : Object.keys(_cast)[0];
		const id = Object.keys(_story)[0];
		cast.push({ id, ..._story[id] });
	}
	return cast;
}

// lire cast -> créer un event sur les entry de la story
function addStartAndEndEvents(_story, _cast) {
	const eventimes = _story.eventimes;
	eventimes.startAt = _cast.startAt;
	eventimes.channel = DEFAULT_NS;
	const entry = _story.entry;
	if (!entry) return { ..._story, eventimes };

	// TODO entry peut etre un tableau
	if (Array.isArray(entry)) return { ..._story, eventimes };

	// const persos = (Array.isArray(entry) ? entry : [entry])
	// .reduce(
	// 	(persosAcc, entry,index,  _story.persos)=>{

	// 	}
	// )

	// TODO entry est un tableau
	function addActionToPerso() {
		const _perso = _story.persos.find((p) => p.id === entry);

		if (!_perso) return _story.persos;
		console.log('_perso->', _perso.actions);

		const defaultEnter = {
			name: 'enter',
			move: _cast.root,
			transition: DEFAULT_TRANSITION_IN,
		};
		const hasEnter = _perso.actions.findIndex((a) => a.name === 'enter');

		if (hasEnter > -1) {
			const enter = { ...defaultEnter, ..._perso.actions[hasEnter] };
			const actions = [..._perso.actions].splice(hasEnter, 1).concat(enter);
			const perso = { ..._perso, actions };
			const persos = _story.persos
				.filter((p) => p.id !== _perso.id)
				.concat(perso);
			return persos;
		} else {
			const enter = defaultEnter;
			const actions = _perso.actions.concat(enter);
			const perso = { ..._perso, actions };
			const persos = _story.persos
				.filter((p) => p.id !== _perso.id)
				.concat(perso);
			return persos;
		}
	}

	const persos = addActionToPerso();
	return { ..._story, eventimes, persos };
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
