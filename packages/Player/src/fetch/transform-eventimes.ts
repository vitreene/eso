import { Eventime } from '../../../types/eventime';
import { pipe } from '../shared/utils';
import { Stories } from './transforms';

export function transformEventimes(s: Stories) {
	const _eventimes = s.eventimes;
	const eventimes = pipe(eventimesStartAt)(_eventimes);
	console.log('eventimes', eventimes);

	return { ...s, eventimes };
}

export function eventimesStartAt(eventimes) {
	const _e = Array.isArray(eventimes)
		? eventimes.flatMap(setStartAt)
		: setStartAt(eventimes);

	function setStartAt(eventime: unknown) {
		let time: string = '';
		let _events: string | any = '';

		// ex	{ 500: 'ev011' }
		if (Object.keys(eventime).length === 1) {
			[time, _events] = Object.entries(eventime).pop();
		} else {
			// 	{ startAt: 1000, name: 'bye' },
			_events = eventime;
		}
		const parseEventime = setParseEventime(time);
		return Array.isArray(_events)
			? // ex {500:['ev011', 'ev111']}
			  _events.map(parseEventime)
			: parseEventime(_events);
	}

	function setParseEventime(time: string) {
		return function (_event) {
			let event: Eventime | {} = {};
			// ex	{ 500: 'ev011' }
			if (typeof _event === 'string') {
				event = {
					startAt: Number(time),
					name: _event,
				};
				// ex { 0: { name: 'go', data: ['un', 'deux', 'trois'] } }
			} else if (typeof _event === 'object') {
				event = {
					startAt: _event.startAt || Number(time),
					name: _event.name || time,
					...(_event.data && { data: _event.data }),
					...(_event.events && {
						events: eventimesStartAt(objectToArray(_event.events)),
					}),
				};
			}
			return event;
		};
	}
	return _e;
}

function objectToArray(obj) {
	if (typeof obj !== 'object') {
		console.warn("ce n'est pas un object : %s", obj);
		return obj;
	}
	const arr = [];
	// propriétés itérables seulement
	for (const o in obj) arr.push({ [o]: obj[o] });
	return arr;
}