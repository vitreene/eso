import { Perso, EsoEventCondensed } from '../../../types/initial';

import { emitter } from '../data/emitter';
import { DEFAULT_NS } from '../data/constantes';
import { sceneUpdateHandler } from '../scene/scene-update-handler';
import { ESO_Namespace } from '../../../types/ESO_Namespace';

export function registerActions(stories: Perso[]) {
	for (const story of stories) {
		const { id, listen, actions } = story;

		if (!listen) continue;

		for (const e of listen) {
			let NS: string = DEFAULT_NS;
			// e == string
			if (typeof e == 'string') {
				sub({ ns: NS, name: e });
			} else {
				let action: string = null;
				let name: string = null;
				// e == EsoEventCondensed
				if (Object.keys(e).length === 1) [name, action] = Object.values(e);
				// e = EsoEvent
				else {
					name = e.event;
					action = e.action;
					NS = e.ns || NS;
				}
				const actionFound = actions.find((a) => a.name === action);
				if (actionFound) {
					const { name: _, ...other } = actionFound;
					sub({
						ns: NS,
						name,
						data: { id, action, ...other },
					});
				} else
					console.warn(
						'l’action %s n’a pas été trouvée. Vérifier les persos.',
						e.action
					);
			}
		}
	}
}

const pub = (story: any) => (other: any) =>
	sceneUpdateHandler({ ...story, ...other });

type Subscribe = {
	ns: ESO_Namespace | string;
	name: string;
	data?: any;
};
const sub = ({ ns, name, data: story = null }: Subscribe) =>
	emitter.on([ns, name], pub(story));
