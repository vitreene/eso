// import { persos } from '../store-persos';
import { onScene } from '../on-scene';

import { activateZoom } from '../../zoom';
import { Root } from '../../composants/Root';

import { CONTAINER_ESO } from '../../data/constantes';

import { scene } from '../../Scene';
const persos = scene.persos;

export function initRuntime(rootId = CONTAINER_ESO, isTemplate) {
	const removeZoom = () => activateZoom(renderOnResize);

	// créer le container de l'app/ uniquement pour template
	if (isTemplate) {
		Root(persos.get(rootId), removeZoom);
		onScene.areOnScene.set(rootId, rootId);
	}

	console.log(
		'onScene.areOnScene',
		isTemplate,
		rootId,
		Array.from(onScene.areOnScene)
	);

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
