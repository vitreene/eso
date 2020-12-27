// register actions, images, action, events
import { Perso } from '../../../types/initial';
import { Eventime } from '../../../types/eventime';

import { registerImages } from '../register/register-images';
import { registerPersos } from '../register/register-persos';
import { registerActions } from '../register/register-actions';
import { registerStraps } from '../register/register-straps';

import { TimeLiner } from '../runtime/solver';
import { clock } from '../runtime/clock';
import { addEventList } from '../runtime/add-event-list';

const timeLiner = new TimeLiner();

export const initStory = async (persos: Perso[], eventimes: Eventime) => {
	await registerImages(persos);
	registerPersos(persos);
	registerActions(persos);
	registerStraps();

	timeLiner.addEventList(eventimes);
	const chrono = clock(timeLiner);
	addEventList(chrono, timeLiner);
};
