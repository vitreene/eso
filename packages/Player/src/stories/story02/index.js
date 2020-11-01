import './casual.css';
import { modelCasuals, casuals, casualEventimes } from './casual-persos';
import { generateCasual } from '../../scripts/casual-init';

const { stories: cards, eventime: casualEvents } = generateCasual(modelCasuals);

const events = [...casualEventimes.events, ...casualEvents];
const eventimes = {
	...casualEventimes,
	events,
};
// console.log('eventimes', eventimes);

const stories = {};
for (const story of casuals.concat(cards)) stories[story.id] = story;

export { stories, eventimes };
