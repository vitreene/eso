import StoreComponents from './store-components';
// import { list } from './List';
// import { layer } from './Layer';
// import { bloc } from './Bloc';
// import { button } from './Button';
// import { img } from './Img';
// import { sprite } from './Sprite';

import * as components from './declare-components';

export function initCreatePerso(Eso, Content) {
	const createPerso = new StoreComponents(Eso, Content);
	for (const c in components) createPerso.register(components[c]);
	return createPerso;
}

// export function initCreatePerso(Eso, Content) {
// 	const createPerso = new StoreComponents();
// 	createPerso.register(list(Eso), Content);
// 	createPerso.register(layer(Eso), Content);
// 	createPerso.register(bloc(Eso), Content);
// 	createPerso.register(button(Eso), Content);
// 	createPerso.register(img(Eso), Content);
// 	createPerso.register(sprite(Eso), Content);
// 	return createPerso;
// }
