import StoreComponents from './store-components';
import { layer } from './Layer';
import { bloc } from './Bloc';
import { button } from './Button';
import { img } from './Img';
import { sprite } from './Sprite';

export function initCreatePerso(Eso) {
	const createPerso = new StoreComponents();
	createPerso.register(layer(Eso));
	createPerso.register(bloc(Eso));
	createPerso.register(button(Eso));
	createPerso.register(img(Eso));
	createPerso.register(sprite(Eso));
	return createPerso;
}
