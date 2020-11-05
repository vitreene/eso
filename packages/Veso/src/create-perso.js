import { o } from 'sinuous';
import { property, isVoid } from './helpers/property';

export const storeNodes = new WeakMap();

export function createPerso() {
	// console.log('createPerso', this);
	const attributes = { content: o('') };
	for (const p in this.current) {
		if (p[0] === 'o' && p[1] === 'n') attributes[p] = this.current[p];
		else attributes[p] = o(this.current[p]);
		// attributes[p] = o(this.current[p]);
	}
	storeNodes.set(this.uuid, this.render({ tag: this.tag, ...attributes }));
	this.attributes = attributes;
	return () => storeNodes.get(this.uuid);
}

export function commit(current) {
	const node = storeNodes.get(this.uuid);
	for (const p in current) {
		if (!this.attributes[p]) {
			this.attributes[p] = o(current[p]);
			node && property(node, this.attributes[p], p);
		} else if (!(p[0] === 'o' && p[1] === 'n')) this.attributes[p](current[p]);

		// p === 'style' && console.log('current[%s]', p, current[p]);
	}
}

export function getComputedStyle(uuid) {
	const node = storeNodes.get(uuid);
	return window ? window.getComputedStyle(node) : null;
}
