import { pipe } from '../shared/utils';
import { transformEventimes } from './transform-eventimes';
import { transformPersos } from './transform-persos';

export interface Story {
	defs?: string[];
	channel: string;
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

export function transforms(yamlStories: Story) {
	// console.log('yaml res:', JSON.stringify(yamlStories, null, 4));
	const stories = pipe(transformEventimes, transformPersos)(yamlStories);
	return stories;
}
