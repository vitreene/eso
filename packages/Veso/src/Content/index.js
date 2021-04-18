import * as declarations from './declare-content';
import { StoreContentFactory } from './store-content';

export const StoreContent = new StoreContentFactory();
for (const content in declarations)
	StoreContent.register(declarations[content]);
