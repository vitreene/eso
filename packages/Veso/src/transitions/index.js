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
			mergeDimensionsInProps
		)({ ...props, transition: [] });

		transition.length && doTransition(props.perso, transition, emitter);
	};
}

function mergeDimensionsInProps(props) {
	if (!props.update && !props.update.dimensions) return props;
	const update = mergeDimensions(props.update);
	return { ...props, update };
}

export function mergeDimensions(_update) {
	if (!_update && !_update.dimensions) return _update;
	const { dimensions, ...update } = _update;
	const dims = doDimensions.update(dimensions);
	const classStyle = {
		...update.classStyle,
		...(dims && dims.classStyle),
	};
	return { ...update, classStyle };
}
