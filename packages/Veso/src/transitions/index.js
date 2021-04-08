import { reslot } from './reslot';
import { setTransitions } from './set-transitions';
import { doTransition } from './transitions-component';
import { onLeaveTransitions } from './on-leave-transitions';

import { pipe } from '../shared/utils';
import { DEFAULT_TRANSITION_IN } from '../shared/constantes';

export function createTransition(emitter, { mergeDimensions }) {
	return function transitions(props) {
		const { transition } = pipe(
			setTransitions,
			onEnterTransition,
			reslot,
			onLeaveTransitions,
			mergeDimensionsInProps
		)({ ...props, transition: [] });
		transition.length && doTransition(props.perso, transition, emitter);
	};

	function mergeDimensionsInProps(props) {
		if (!props.update && !props.update.dimensions) return props;
		const update = mergeDimensions(props.update);
		return { ...props, update };
	}
}

function onEnterTransition({ transition, ...props }) {
	if (props.update.enter) {
		!transition.length && transition.push({ to: DEFAULT_TRANSITION_IN });
	}
	return { ...props, transition };
}
