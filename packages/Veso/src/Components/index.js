// import { StoreContent } from './Content';
import { StoreComponents } from './store-components';
import { StoreContentFactory } from '../Content/store-content';

import * as components from './declare-components';
import * as declarations from '../Content/declare-content';

export function initCreatePerso(Eso, contentTypes) {
	const StoreContent = new StoreContentFactory();
	for (const content in declarations)
		StoreContent.register(declarations[content]);
	for (const content of contentTypes) StoreContent.create(...content);

	const createPerso = new StoreComponents(Eso, StoreContent);
	for (const c in components) createPerso.register(components[c]);
	return createPerso;
}
