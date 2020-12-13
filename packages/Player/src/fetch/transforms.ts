const deepmerge = require('deepmerge');

import { pipe } from '../shared/utils';
import { transformEventimes } from './transform-eventimes';
import { transformPersos } from './transform-persos';

export interface Story {
	defs?: string[];
	eventimes?: unknown;
	persos?: Perso[];
}

export interface Perso {
	id: string;
	nature: string;
	initial: unknown;
	listen?: unknown;
	actions: unknown;
	emit?: unknown;
}

export function transforms(yamlStories: Story) {
	console.log('yaml res:', JSON.stringify(yamlStories, null, 4));
	const stories = pipe(transformEventimes, transformPersos)(yamlStories);

	let test = deepmerge(stories.persos[0], stories.persos[1]);
	console.log('deepmerge', test);

	return stories;
}
