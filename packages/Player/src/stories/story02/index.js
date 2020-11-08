import './casual.css';

import { persos } from './persos';
import { layers } from './layers';
import { models } from './models';
import { casualEventimes } from './eventimes';

import { generateCasual } from './casual-init';

const casual = generateCasual(models);

const eventimes = {
	...casualEventimes,
	events: [...casualEventimes.events, ...casual.eventimes],
};

const stories = {};
for (const story of layers.concat(persos, casual.stories)) {
	// console.log('story', story);
	stories[story.id] = story;
}

export { stories, eventimes };
