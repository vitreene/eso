import { activateZoom } from '../src/zoom';
import { Root } from './xx-Root';

import { CONTAINER_ESO, APP_ID } from '../src/data/constantes';

export const appContainer = document.getElementById(APP_ID);

//// obsolete
export function XX_initRuntime(
	rootId = CONTAINER_ESO,
	isTemplate,
	persos,
	onScene
) {
	// créer le container de l'app/ uniquement pour template
	if (isTemplate) {
		const removeZoom = () => activateZoom(renderOnResize);
		Root(persos.get(rootId).node, appContainer, removeZoom);
		onScene.areOnScene.set(rootId, rootId);
	}

	// relancer le rendu des Persos si resize
	/* 
	zoom n'a pas la meme valeur selon la story
	comment servir la bonne valeur ?	
	- chaque story a sa valeur zoom, 
	- au resize
		- chaque zoom se met à jour 
		- le zoom adequat est envoyé à chaque element visible

	*/
	function renderOnResize(zoom) {
		for (const id of onScene.areOnScene.keys()) {
			persos.has(id) && persos.get(id).prerender(zoom);
		}
	}
}
