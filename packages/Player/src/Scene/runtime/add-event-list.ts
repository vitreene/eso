import { Eventime } from '../../../../types/eventime';
import { TimeLiner } from './solver';

import { emitter } from '../../App/emitter';
import { STRAP, TEMP } from '../../data/constantes';

export function addEventList(chrono: () => number, timeLiner: TimeLiner): void {
	emitter.on([STRAP, 'add-event-list'], (data: Eventime) =>
		eventList(data, chrono, timeLiner)
	);
}

function eventList(data: Eventime, c: () => number, timeLiner: TimeLiner) {
	const chrono = c();
	console.log('addEventList', data, c);
	// level:01 est la timeline dédiée, par dessus static
	timeLiner.addEventList(data, { level: TEMP, chrono });
}
