// les events sont prefixés selon leur destination :
// - TC, EV, ST...
// si ns n'est pas précisé, c'est la valeurpar défaut.

import { Eventime } from '../../../../types/eventime';

export const eventimes: Eventime = {
	name: 'start',
	start: 0,
	events: [
		{ start: 0, name: 'go', data: ['un', 'deux', 'trois'] },
		{ start: 500, name: 'ev011' },
		{ start: 1000, name: 'ev012' },
		{ start: 2000, name: 'ev013' },
		{ start: 3000, name: 'ev014' },
		{ start: 4000, name: 'ev015' },
		{
			start: 5000,
			name: 'leave-root',
			events: [{ start: 1000, name: 'bye', data: ['quatre', 'cinq', 'six'] }],
		},
	],
};

// preciser le namespace
// s'il n'est pas celui par défaut
// { ns: TC, start: 3500, name: PAUSE }
