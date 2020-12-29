import { nanoid } from 'nanoid';
import { pipe } from '../shared/utils';
import { transformEventimes } from './transform-eventimes';
import { transformPersos } from './transform-persos';

export interface Stories {
	defs?: string[];
	stories: Story[];
	persos?: PersoInput[];
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

export function transforms(yamlStories: Stories) {
	// console.log('yaml res:', JSON.stringify(yamlStories, null, 4));
	const stories = pipe(
		// transformEventimes,
		transformPersos,
		transformStories
	)(yamlStories);

	console.log('Stories', stories);
	return stories;
}

function transformStories(s: Stories) {
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
