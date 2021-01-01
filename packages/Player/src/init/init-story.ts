// register actions, images, action, events
import { Eventime } from '../../../types/eventime';
import { Story, StoryWoEventimes } from '../../../types/Entries-types';

import { registerImages } from '../register/register-images';
import { registerPersos } from '../register/register-persos';
import { registerActions } from '../register/register-actions';
import { registerStraps } from '../register/register-straps';

import { initRuntime } from '../runtime';
import { TimeLiner } from '../runtime/solver';
import { clock } from '../runtime/clock';
import { addEventList } from '../runtime/add-event-list';

import { DEFAULT_NS } from '../data/constantes';

const timeLiner = new TimeLiner();
const c = clock(timeLiner);
addEventList(c.chrono, timeLiner);

export const start = c.start;

export const initStory = async (story: Story) => {
	const { eventimes, ...others } = story;
	addEventsToTimeLine(eventimes);
	await register(others);
};

function addEventsToTimeLine(eventimes: Eventime) {
	timeLiner.addEventList(eventimes, { level: DEFAULT_NS });
}

async function register(story: StoryWoEventimes) {
	const { isTemplate, root, channel, persos } = story;
	await registerImages(persos);
	registerPersos(persos);
	registerActions(channel, persos);
	registerStraps();
	initRuntime(root, isTemplate);
}
