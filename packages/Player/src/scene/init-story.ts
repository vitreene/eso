// register actions, images, action, events
import { Perso } from '../../../types/initial';
import { Eventime } from '../../../types/eventime';

import { registerImages } from '../register/register-images';
import { registerPersos } from '../register/register-persos';
import { registerActions } from '../register/register-actions';
import { registerStraps } from '../register/register-straps';
import { initRuntime } from '../runtime';

import { TimeLiner } from '../runtime/solver';
import { clock } from '../runtime/clock';
import { addEventList } from '../runtime/add-event-list';

const timeLiner = new TimeLiner();
const c = clock(timeLiner);
addEventList(c.chrono, timeLiner);

export const start = c.start;

type Story = {
	channel: string;
	persos: Perso[];
	eventimes: Eventime;
};
export const initStory = async ({ channel, persos, eventimes }: Story) => {
	console.log({ channel, persos, eventimes });

	addEventsToTimeLine(channel, eventimes);
	await register(channel, persos);
};

function addEventsToTimeLine(channel: string, eventimes: Eventime) {
	timeLiner.addEventList(eventimes, { level: channel });
}

async function register(channel: string, persos: Perso[]) {
	await registerImages(persos);
	registerPersos(persos);
	registerActions(channel, persos);
	registerStraps();
	initRuntime();
}
