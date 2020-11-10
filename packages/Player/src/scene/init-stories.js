// register actions, images, action, events
import { registerImages } from '../register/register-images';
import { registerPersos } from '../register/register-persos';
import { registerActions } from '../register/register-actions';
import { registerStraps } from '../register/register-straps';

export const initStories = async (stories, eventimes) => {
	await registerImages(stories);
	registerPersos(stories);
	registerActions(stories);
	registerStraps(eventimes);
};
