import { o } from 'sinuous';

import { property } from './shared/property';

export const storeNodes = new WeakMap();

export function createPerso() {
	// console.log('createPerso', this);
	const attributes = { content: o('') };
	for (const p in this.current) {
		if (p[0] === 'o' && p[1] === 'n') attributes[p] = this.current[p];
		else attributes[p] = o(this.current[p]);
	}
	console.log('attributes', this.id, attributes.content());
	storeNodes.set(this.uuid, this.render({ tag: this.tag, ...attributes }));
	this.attributes = attributes;
	return () => storeNodes.get(this.uuid);
}

export function commit(props) {
	const { content, ...current } = props;
	const node = storeNodes.get(this.uuid);
	for (const p in current) {
		if (!this.attributes[p]) {
			this.attributes[p] = o(current[p]);
			node && property(node, this.attributes[p], p);
		} else if (!(p[0] === 'o' && p[1] === 'n')) this.attributes[p](current[p]);

		const hasNewContent = this.attributes.content() !== content;
		if (hasNewContent) this.attributes.content(content);

		// p === 'style' && console.log('current[%s]', p, current[p]);
	}
}

export function getComputedStyle(uuid) {
	const node = storeNodes.get(uuid);
	return window ? window.getComputedStyle(node) : null;
}
