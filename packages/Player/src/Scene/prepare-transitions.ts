import { DEFAULT_STYLES, MISSING } from '../data/constantes';
import { Style } from '../../../types/initial';

export function prepareTransitions(perso) {
	const { initial, actions } = perso;
	if (!actions) return perso;
	const styleProps = initial
		? {
				...DEFAULT_STYLES,
				...initial.classStyle,
				...initial.dimensions,
				...initial.style,
		  }
		: DEFAULT_STYLES;

	const toStyles: Style[] = actions
		.map((action) => action.transition?.to)
		.filter(Boolean)
		.filter((action) => typeof action === 'object');
	const transitionsProps = Object.keys(Object.assign({}, ...toStyles));

	const to = {};
	for (const p of transitionsProps)
		to[p] = styleProps[p] === undefined ? MISSING : styleProps[p];

	return { ...perso, to };
}
