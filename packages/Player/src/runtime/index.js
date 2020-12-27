import { persos } from '../data/store-persos';
import { onScene } from '../data/on-scene';

import { activateZoom } from '../zoom';
import { Root } from '../composants/Root';

import { CONTAINER_ESO } from '../data/constantes';

export function initRuntime() {
	const removeZoom = () => activateZoom(renderOnResize);

	// créer le container de l'app
	Root(persos.get(CONTAINER_ESO), removeZoom);
	onScene.areOnScene.set(CONTAINER_ESO, CONTAINER_ESO + '_s01');

	// relancer le rendu des Persos si resize
	function renderOnResize(zoom) {
		for (const id of onScene.areOnScene.keys()) {
			persos.has(id) && persos.get(id).prerender(zoom);
		}
	}
}
