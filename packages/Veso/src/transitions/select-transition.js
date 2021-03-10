import { DEFAULT_DURATION } from '../shared/constantes';
import { effect } from '../presets/transition-effects-presets';

/* 
propTo :
- string : 'FadeIn'
- object : { ...to, duration ? }
// pas traité 
- object : {effect: 'FadeIn', duration: 500}
*/

export function selectTransition({
	from: propFrom,
	to: propTo,
	duration = DEFAULT_DURATION,
}) {
	let actualTo;
	let direct = false;
	switch (true) {
		case typeof propTo === 'string':
			actualTo = { to: effect[propTo].to, duration };
			direct = true;
			break;
		case !!propTo && !!propTo.effect:
			actualTo = {
				to: effect[propTo.effect].to,
				duration: propTo.duration || DEFAULT_DURATION,
			};
			break;

		default:
			const { duration: durationTo, ...effectTo } = propTo;
			actualTo = { to: effectTo, duration: durationTo || duration };
			break;
	}
	let from = propFrom;

	if (!propFrom || Object.keys(propFrom).length === 0) {
		switch (true) {
			case typeof propTo === 'string':
				from = effect[propTo].from;
				direct = true;

				break;
			case !!propTo.effect:
				from = effect[propTo.effect].from;
				break;

			default:
				from = {};
				break;
		}
	}

	const transition = {
		from,
		...actualTo,
		direct,
	};

	return transition;
}

export function directTransition(props) {
	return {
		from: props.from,
		to: props.to,
		duration: props.duration || DEFAULT_DURATION,
		direct: true,
	};
}
