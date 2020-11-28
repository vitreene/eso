import { Perso } from '../../../types/initial';

import { emitter } from '../data/emitter';
import { DEFAULT_NS } from '../data/constantes';
import { sceneUpdateHandler } from '../scene/scene-update-handler';
import { ESO_Namespace } from '../../../types/ESO_Namespace';

export function registerActions(stories: Perso[]) {
	for (const story of stories) {
		const { id, listen, actions } = story;

		if (!listen) continue;

		for (const e of listen) {
			let ns: ESO_Namespace = DEFAULT_NS;
			let name: string = null;
			let action: string = null;
			// e == string
			if (typeof e == 'string') {
				action = e;
				name = e;
				// e == EsoEventCondensed
			} else if (Array.isArray(e)) {
				[name, action] = e;
			}
			// e = EsoEvent
			else {
				name = e.event;
				action = e.action;
				ns = e.ns || ns;
			}

			const actionFound = actions.find((a) => a.name === action);
			if (actionFound) {
				const { name: _, ...other } = actionFound;
				subscribe({
					ns: ns,
					name,
					data: { id, action, ...other },
				});
			} else
				console.warn(
					'l’action %s n’a pas été trouvée. Vérifier les persos.',
					action
				);
		}
	}
}

type Subscribe = {
	ns: ESO_Namespace;
	name: string;
	data?: any;
};
function subscribe({ ns, name, data = null }: Subscribe) {
	return emitter.on([ns, name], publish(data));
}

function publish(data: any) {
	return (other: any) => sceneUpdateHandler({ ...data, ...other });
}
