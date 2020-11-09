import { emitter } from '../data/emitter';
import { DEFAULT_NS } from '../data/constantes';
import { sceneUpdateHandler } from '../scene/scene-update-handler';

export function registerActions(stories) {
	for (const story of stories) {
		const { id, listen, actions } = story;

		if (!listen) continue;

		for (const e of listen) {
			const NS = e.ns || DEFAULT_NS;
			const actionFound = actions.find((a) => a.name === e.action);
			if (actionFound) {
				const { name, ...other } = actionFound;
				const action = {
					NS,
					name: e.event,
					data: {
						id,
						action: name,
						...other,
					},
				};
				sub(action);
			} else
				console.warn(
					'l’action %s n’a pas été trouvée. Vérifier les persos.',
					e.action
				);
		}
	}
}

const pub = (story) => (other) => sceneUpdateHandler({ ...story, ...other });

const sub = ({ NS, name, data: story }) => emitter.on([NS, name], pub(story));
