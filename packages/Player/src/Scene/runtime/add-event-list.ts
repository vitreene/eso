import { Eventime } from '../../../../types/eventime';
import { TimeLiner } from './solver';

import { emitter } from '../../data/emitter';
import { STRAP } from '../../data/constantes';

export function addEventList(chrono, timeLiner): void {
	emitter.on([STRAP, 'add-event-list'], (data: Eventime) =>
		eventList(data, chrono, timeLiner)
	);
}

function eventList(data: Eventime, chrono: () => number, timeLiner: TimeLiner) {
	const c = chrono();
	console.log('addEventList', data, c);
	// level:01 est la timeline dédiée, par dessus static
	timeLiner.addEventList(data, { level: 'temp', chrono: c });
}
