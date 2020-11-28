import { Eventime } from '../../../types/eventime';
import { TimeLiner } from '../runtime/solver';

export default function addEventList(
	data: Eventime,
	chrono: () => number,
	timeLiner: TimeLiner
) {
	const c = chrono();
	console.log('addEventList', data, c);
	// level:01 est la timeline dédiée, par dessus static
	timeLiner.addEventList(data, { level: '01', chrono: c });
}
