import { Eventime } from '../../../types/eventime';
import { Story } from '../../../types/Entries-types';
import { pipe, objectToArray } from '../shared/utils';

export function transformEventimes(s: Story) {
	if (!s.eventimes) return s;
	const _eventimes = s.eventimes;
	const channel: string = s.channel;
	const eventimes = pipe(
		eventimesStartAt,
		eventimesAddChannel(channel)
	)(_eventimes);
	return { ...s, eventimes };
}

export function eventimesAddChannel(channel: string) {
	return function addChannel(eventimes: Eventime) {
		const events = eventimes.events ? eventimes.events.map(addChannel) : null;
		//si channel est déjà défini, il a la priorité
		return { channel, ...eventimes, ...(events && { events }) };
	};
}

export function eventimesStartAt(eventimes) {
	const _e = Array.isArray(eventimes)
		? eventimes.flatMap(setStartAt)
		: setStartAt(eventimes);
	return _e;
}

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

function setParseEventime(_time: string) {
	const time = Number.isNaN(Number(_time)) ? _time : Number(_time);
	return function (_event) {
		let event: Eventime | {} = {};
		// ex	{ 500: 'ev011' }
		if (typeof _event === 'string') {
			event = {
				startAt: time,
				name: _event,
			};
			// ex { 0: { name: 'go', data: ['un', 'deux', 'trois'] } }
		} else if (typeof _event === 'object') {
			event = {
				...(_event.channel && { channel: _event.channel }),
				startAt: _event.startAt || time,
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
