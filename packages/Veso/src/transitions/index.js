import { reslot } from './reslot';
import { setTransitions } from './set-transitions';
import { mergeDimensions } from '../shared/dimensions';
import { doTransition } from './transitions-component';
import { onLeaveTransitions } from './on-leave-transitions';

import { pipe, log } from '../shared/utils';

import { DEFAULT_DURATION, DEFAULT_TRANSITION_IN } from '../shared/constantes';

export function createTransition(emitter) {
	// props: { perso, update, seek, changed, box: zoomBox, updateSlot }
	return function transitions(props) {
		const { transition } = pipe(
			setTransitions,
			onEnterTransition,
			reslot,
			onLeaveTransitions,
			mergeDimensionsInProps,
			transitionToDefault,
			filterEmptyTransition,
			setDefaultProgress(props.seek)
			// log('result : ')
		)({ ...props, transition: [] });
		transition.length &&
			doTransition(props.seek, props.perso, transition, emitter);
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
function filterEmptyTransition(_props) {
	// if (!_props.transition || !_props.transition.length) return _props;
	const { transition, ...props } = _props;
	return {
		...props,
		transition: transition.filter((t) => {
			return !(
				typeof t.from === 'object' &&
				!Object.keys(t.from).length &&
				typeof t.to === 'object' &&
				!Object.keys(t.to).length
			);
		}),
	};
}

function setDefaultProgress(seek) {
	return function _setDefaultProgress(_props) {
		if (!seek) return _props;
		const { transition, ...props } = _props;
		for (const t of transition) {
			if (!t.progress) t.progress = 1;
		}

		return { ...props, transition };
	};
}

function transitionToDefault({ transition, ...props }) {
	if (Object.keys(props.perso.to).length) {
		let d = transition.map((t) => t.duration).filter(Boolean);
		const duration = d.length ? Math.min(...d) : DEFAULT_DURATION;
		const progress = Math.min(
			...transition.map((t) => (t.progress === undefined ? 1 : t.progress))
		);
		transition.unshift({
			from: {},
			to: props.perso.to,
			duration,
			...(props.seek && { progress }),
		});
	}
	return { ...props, transition };
}
