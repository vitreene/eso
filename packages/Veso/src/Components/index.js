import { createEso } from '../eso';
import { createTransition } from '../transitions/index';
import { StoreComponents } from './store-components';
import { StoreContentFactory } from '../Content/store-content';
import { registerPersos } from '../register/register-persos';
import { updateComponent } from '../update-component';

import * as components from './declare-components';
import * as declarations from '../Content/declare-content';

export function initVeso(emitter, contentTypes) {
	const StoreContent = createStoreContent(contentTypes);
	const createPerso = createStoreComponents(emitter, StoreContent);

	const transition = createTransition(emitter);
	const register = registerPersos(createPerso, contentTypes);
	const update = updateComponent(transition);
	return { register, update };
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
