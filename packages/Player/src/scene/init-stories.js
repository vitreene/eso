// register persos, actions, images, events

import { emitter } from '../runtime/emitter';

import { registerImages } from '../register/register-images';
import { registerPersos } from '../register/register-persos';
import { registerActions } from '../register/register-actions';

// import { slots } from '../composants/Layer';
import { storeSlots } from '../composants/slot';

export const initStories = (stories) =>
  registerImages(stories).then((imagesCollection) => {
    const persos = registerPersos(stories, imagesCollection, emitter);
    const actions = registerActions(stories, emitter);

    return {
      persos,
      actions,
      slots: storeSlots,
    };
  });
