import './casual.css';

import { casting } from './persos';
import { layers } from './layers';
import { models } from './models';
import { casualEventimes } from './eventimes';

import { generateCasual } from './casual-init';

const casual = generateCasual(models);

const eventimes = {
	...casualEventimes,
	events: [...casualEventimes.events, ...casual.eventimes],
};
const stories = [...layers, ...casting, ...casual.stories];

export { stories, eventimes };
