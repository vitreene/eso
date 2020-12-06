import { Perso } from '../../../types/initial';

import { pipe } from '../shared/utils';
import { transformEventimes } from './transform-eventimes';

export interface Stories {
	defs?: string[];
	eventimes?: unknown;
	perso?: unknown[];
}

export function transforms(yamlStories: Stories) {
	console.log('yaml res:', JSON.stringify(yamlStories, null, 4));
	const stories = pipe(transformEventimes, natureSetProperty)(yamlStories);
	return stories;
}

function natureSetProperty(s: Stories) {
	const _persos = s.perso;
	const persos = [];
	for (const _perso of _persos) {
		console.log(_perso);

		const nature = Object.keys(_perso).pop();
		const other = _perso[nature];
		// si nature est déclaré, il est prioritaire ?
		const perso: Perso = { nature, ...other };
		persos.push(perso);
	}
	console.log('persos-->', persos);

	return { ...s, perso: persos };
}
