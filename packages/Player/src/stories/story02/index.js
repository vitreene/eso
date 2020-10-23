import './casual.css';
import { prepCasuals, casuals, casualEventimes } from './casual-persos';
import { generateCasual } from '../../scripts/casual-init';

const { stories: cards, events: casualEvents } = generateCasual(prepCasuals);

const eventimes = {
  ...casualEventimes,
  events: [...casualEventimes.events, ...casualEvents],
};
console.log('eventimes', eventimes);

const stories = {};
for (const story of casuals.concat(cards)) stories[story.id] = story;

export { stories, eventimes };
