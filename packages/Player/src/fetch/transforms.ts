import { nanoid } from 'nanoid';
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
		transformStories
		// transformScene
	)(yamlStories);

	console.log('scene', scene);
	return scene;
}

/* TODO

*/
function transformScene(s: SceneEntry) {
	const template = s.stories.find((story) => story.id === s.scene.template);
	const scenes = s.scene.cast.map((cast) => {
		const _storyName = typeof cast === 'string' ? cast : Object.keys(cast)[0];
		return s.stories.find((story) => story.id === _storyName);
	});
	return s;
}

function transformStories(s: SceneEntry) {
	const stories = s.stories.map(
		pipe(setIdAndChannel, transformEventimes, transformPersos)
	);
	return stories;
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
