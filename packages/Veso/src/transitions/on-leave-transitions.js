import { DEFAULT_NS, DEFAULT_TRANSITION_OUT } from '../shared/constantes';

export function onLeaveTransitions({ transition, ...props }) {
	if (props.changed?.status === 'leave') {
		const oncomplete = {
			event: {
				channel: props.channel || DEFAULT_NS,
				name: 'leave-' + props?.id,
			},
		};

		transition?.length === 0 && transition.push({ to: DEFAULT_TRANSITION_OUT });

		const lastTransition = transition.pop();
		console.log(
			'lastTransition , transition.',
			props,
			lastTransition,
			transition
		);
		lastTransition.oncomplete
			? lastTransition.oncomplete.push(oncomplete)
			: (lastTransition.oncomplete = [oncomplete]);
		transition.push(lastTransition);
	}

	return { ...props, transition };
}
