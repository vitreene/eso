import { observe } from 'disco';
import { storeNodes } from 'veso';
import { APP_ID } from '../data/constantes';

const appContainer = document.getElementById(APP_ID);

// à passer dans veso ?
export function Root(root, handler) {
	const node = storeNodes.get(root.uuid);
	observe(node);
	appContainer.appendChild(node);
	node.addEventListener('disconnected', handler());
}
