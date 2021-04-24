import { createEso } from '../eso';
import { StoreComponents } from './store-components';
import { StoreContentFactory } from '../Content/store-content';

import * as components from './declare-components';
import * as declarations from '../Content/declare-content';

export function initCreatePerso(emitter, contentTypes) {
	const StoreContent = createStoreContent(contentTypes);
	const createPerso = createStoreComponents(emitter, StoreContent);
	return createPerso;
}

function createStoreContent(contentTypes) {
	const StoreContent = new StoreContentFactory();
	for (const content in declarations)
		StoreContent.register(declarations[content]);
	for (const type in contentTypes)
		StoreContent.create(type, contentTypes[type]);
	return StoreContent;
}

function createStoreComponents(emitter, StoreContent) {
	const Eso = createEso(emitter);
	const createPerso = new StoreComponents(Eso, StoreContent);
	for (const c in components) createPerso.register(components[c]);
	return createPerso;
}

/* 
il faudrait retourner scenePersos pour ajouter à celui de Scene 

initCreatePerso( emitter, contentTypes, persos, scenePersos)
const {transition, Eso} = createEso(emitter)
registerPersos(persos, scenePersos, createPerso)

return scenePersos
*/
