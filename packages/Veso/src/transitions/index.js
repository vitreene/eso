import { pipe } from '../shared/utils';
import { reslot } from './reslot';
import { doTransition } from './transitions-component';

import { onLeaveTransitions } from './on-leave-transitions';
import { setTransitions } from './set-transitions';

export function createTransition(emitter) {
	return function transitions(props) {
		const { transition } = pipe(
			setTransitions,
			reslot,
			onLeaveTransitions
		)({ ...props, transition: [] });

		transition.length && doTransition(props.perso, transition, emitter);
	};
}
