import { pipe } from '../shared/utils';
import { reslot } from './reslot';
import { doTransition } from './transitions-component';
import { doDimensions } from '../components/dimensions-component';

import { onLeaveTransitions } from './on-leave-transitions';
import { setTransitions } from './set-transitions';

export function createTransition(emitter) {
	return function transitions(props) {
		const { transition } = pipe(
			setTransitions,
			reslot,
			onLeaveTransitions,
			mergeDimensions
		)({ ...props, transition: [] });

		transition.length && doTransition(props.perso, transition, emitter);
	};
}

function mergeDimensions(props) {
	console.log('mergeDimensions', typeof doDimensions);
	if (!props.update && !props.update.dimensions) return props;

	const { dimensions, ...update } = props.update;
	const dims = doDimensions.update(dimensions);
	const classStyle = {
		...update.classStyle,
		...(dims && dims.classStyle),
	};

	return {
		...props,
		update: {
			...update,
			classStyle,
		},
	};
}
