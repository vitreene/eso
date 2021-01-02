import { Perso } from '../../../../types/initial';
import { subscribe } from './subscribe';

// TODO simplifier
export function registerActions(_channel: string, persos: Perso[]) {
	for (const perso of persos) {
		const { id, listen, actions } = perso;
		if (!listen) continue;
		// passer cette logique dans la transformation yaml
		for (const e of listen) {
			let channel = _channel;
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
			// _channel === 'strap.toggle' &&

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
