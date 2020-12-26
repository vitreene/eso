import { Perso } from '../../../types/initial';

import { emitter } from '../data/emitter';
import { DEFAULT_NS } from '../data/constantes';
import { sceneUpdateHandler } from '../scene/scene-update-handler';
import { ESO_Channel } from '../../../types/ESO_enum';

export function registerActions(stories: Perso[]) {
	for (const story of stories) {
		const { id, listen, actions } = story;

		if (!listen) continue;
		// passer cette logique dans la transformation yaml
		for (const e of listen) {
			let channel: ESO_Channel = DEFAULT_NS;
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
				channel = e.channel || channel;
			}
			// FIXME choisir le format objet ou tableau pour les actions
			// const actionFound = Array.isArray(actions)
			// 	? actions.find((a) => a.name === action)
			// 	: actions[action];

			const actionFound = actions.find((a) => a.name === action);
			if (actionFound) {
				const { name: _, ...other } = actionFound;
				subscribe({
					channel: channel,
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
	channel: ESO_Channel;
	name: string;
	data?: any;
};
function subscribe({ channel, name, data = null }: Subscribe) {
	return emitter.on([channel, name], publish(data));
}

function publish(data: any) {
	return (other: any) => sceneUpdateHandler({ ...data, ...other });
}
