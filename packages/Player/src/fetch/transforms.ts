import { nanoid } from 'nanoid';
import { CONTAINER_ESO, DEFAULT_NS, MAIN } from '../data/constantes';
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

	console.log('scene', scene);
	return scene;
}

function transformScene(s: SceneEntry) {
	const cast = sceneExpandCast(s);
	const template = s.stories.find((story) => story.id === s.scene.template);
	template.isTemplate = true;
	const stories = cast.map((_cast) => {
		const story = s.stories.find((_story) => _story.id === _cast.id);
		return addStartAndEndEvents(story, _cast);
	});
	return { ...s, scene: { ...s.scene, cast }, stories: [template, ...stories] };
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
function addStartAndEndEvents(_story, cast) {
	_story.eventimes.startAt = cast.startAt;
	_story.eventimes.channel = DEFAULT_NS;
	return _story;
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
