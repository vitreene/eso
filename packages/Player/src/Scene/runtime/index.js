import { CONTAINER_ESO, APP_ID } from '../../data/constantes';
export const appContainer = document.getElementById(APP_ID);

export function initRuntime(
	rootId = CONTAINER_ESO,
	isTemplate,
	persos,
	onScene
) {
	if (isTemplate) {
		appContainer.appendChild(persos.get(rootId).node);
		onScene.areOnScene.set(rootId, rootId);
	}
}
