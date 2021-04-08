export function setTransitions({ transition, ...props }) {
	if (props.update.transition) {
		Array.isArray(props.update.transition)
			? transition.push(...props.update.transition)
			: transition.push(props.update.transition);
	}

	return { ...props, transition };
}
