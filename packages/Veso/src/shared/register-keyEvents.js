import { MAIN, STRAP } from './constantes';

export function registerKeyEvents(emit, emitter) {
	const keyEvents = {};
	if (emit) {
		const emitEvent = (events, e) => {
			(Array.isArray(events) ? events : [events]).forEach((event) => {
				const {
					event: { channel = MAIN, name },
					data,
				} = event;
				// console.log(' channel, name, data : ', channel, name, data);
				// console.log(' E : ', e);
				emitter.emit(
					[channel, name],
					{ ...data, ...(channel === STRAP && { e }) } || name
				);
			});
		};
		for (const event in emit)
			keyEvents['on' + event] = (e) => emitEvent(emit[event], e);
	}
	return keyEvents;
}
