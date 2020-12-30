import { nanoid } from 'nanoid';
import { DEFAULT_NS } from '../data/constantes';
import { pipe } from '../shared/utils';
import { transformEventimes } from './transform-eventimes';
import { transformPersos } from './transform-persos';

export interface SceneEntry {
	defs?: string[];
	scene: Scene;
	stories: Story[];
	persos?: PersoInput[];
}

export interface Scene {
	id: string;
	name: string;
	template: string;
	cast: {
		[ref: string]: {
			id?: string;
			startAt: string;
			root: string;
		};
	}[];
}

export interface Story {
	id?: string;
	channel?: string;
	eventimes?: unknown;
	persos?: PersoInput[];
}

export interface PersoInput {
	id: string;
	nature: string;
	initial: unknown;
	listen?: unknown;
	actions: unknown;
	emit?: unknown;
}

/* 
const scene: Scene = {
	id: 'scene 1',
	name: 'introduction',
	template: 'scene-w-telco',
	cast: [
		{
			'story01': {
				startAt: 'start',
				root: 'main',
			},
		},
	],
};
 */

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

/* TODO

*/
function transformScene(s: SceneEntry) {
	const cast = sceneExpandCast(s);
	const template = s.stories.find((story) => story.id === s.scene.template);
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

function setIdAndChannel(s: Story) {
	const story = s;
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
