import { observe } from 'disco';

// à passer dans veso ?
export function Root(node, container, handler) {
	observe(node);
	container.appendChild(node);
	node.addEventListener('disconnected', handler());
}
