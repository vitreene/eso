// register actions, images, events
import { registerImages } from '../register/register-images';
import { registerPersos } from '../register/register-persos';
import { registerActions } from '../register/register-actions';
import { registerStraps } from '../register/register-straps';

// import { sceneUpdateHandler } from '../scene/scene-update-handler';

import { TimeLiner } from '../runtime/solver';
import { clock } from '../runtime/clock';

export const initStories = async (stories, eventimes) => {
	await registerImages(stories);
	registerPersos(stories);

	const timeLiner = new TimeLiner(eventimes);
	const chrono = clock(timeLiner);
	registerStraps(chrono, timeLiner);

	/* const actions =  */ registerActions(stories);
	// actions(sceneUpdateHandler);
};
