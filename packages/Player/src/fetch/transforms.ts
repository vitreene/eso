import { pipe } from '../shared/utils';
import { transformEventimes } from './transform-eventimes';
import { transformPersos } from './transform-persos';

export interface Stories {
	defs?: string[];
	eventimes?: unknown;
	persos?: unknown[];
}

export function transforms(yamlStories: Stories) {
	console.log('yaml res:', JSON.stringify(yamlStories, null, 4));
	const stories = pipe(transformEventimes, transformPersos)(yamlStories);
	return stories;
}
