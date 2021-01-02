// register actions, images, action, events
import { Eventime } from '../../../types/eventime';
import { Story, StoryWoEventimes } from '../../../types/Entries-types';

import { registerImages } from '../Scene/register/register-images';
import { registerPersos } from '../Scene/register/register-persos';
import { registerActions } from '../Scene/register/register-actions';
import { registerStraps } from '../Scene/register/register-straps';

import { initRuntime } from '../Scene/runtime';
import { TimeLiner } from '../Scene/runtime/solver';
import { clock } from '../Scene/runtime/clock';
import { addEventList } from '../Scene/runtime/add-event-list';

import { DEFAULT_NS } from '../data/constantes';

const timeLiner = new TimeLiner();
const c = clock(timeLiner);
addEventList(c.chrono, timeLiner);

export const start = c.start;

registerStraps();

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
	initRuntime(root, isTemplate);
}
