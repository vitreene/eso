// les events sont prefixés selon leur destination :
// - TC, EV, ST...
// si ns n'est pas précisé, c'est la valeurpar défaut.

import { Eventime } from '../../../../types/eventime';

export const eventimes: Eventime = {
	name: 'start',
	startAt: 0,
	events: [
		{ startAt: 0, name: 'go', data: ['un', 'deux', 'trois'] },
		{ startAt: 500, name: 'ev011' },
		{ startAt: 1000, name: 'ev012' },
		{ startAt: 2000, name: 'ev013' },
		{ startAt: 3000, name: 'ev014' },
		{ startAt: 4000, name: 'ev015' },
		{
			startAt: 5000,
			name: 'leave-root',
			events: [{ startAt: 1000, name: 'bye', data: ['quatre', 'cinq', 'six'] }],
		},
	],
};

// preciser le namespace
// s'il n'est pas celui par défaut
// { ns: TC, start: 3500, name: PAUSE }
