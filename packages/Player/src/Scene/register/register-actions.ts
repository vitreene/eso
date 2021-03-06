import { EsoAction, Perso } from '../../../../types/initial';
// import { emitter } from '../../App/init';

type Subscribe = {
	channel: string;
	name: string;
	data?: any;
};

export function registerActions(
	_channel: string,
	persos: Perso[],
	publish,
	emitter
) {
	const subscribe = initSubscribe(publish, emitter);
	for (const perso of persos) {
		const { id, listen, actions } = perso;
		if (!listen) continue;
		for (const e of listen) {
			const channel: string = e.channel || _channel;
			const name: string = e.event;
			const action: string = e.action;
			const actionFound: EsoAction = actions.find((a) => a.name === action);
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
					action,
					{ listen, actions }
				);
		}
	}
}

function initSubscribe(publish, emitter) {
	return function subscribe({ channel, name, data = null }: Subscribe) {
		return emitter.on([channel, name], publish({ channel, ...data }));
	};
}
