import { Perso } from '../../../types/initial';

import { STRAP, TC, PLAY, PAUSE, TOGGLE } from '../data/constantes';

const actions: Perso = {
	id: 'togglePlay',
	nature: 'button',
	initial: {
		statStyle: {
			color: 'white',
			backgroundColor: 'blue',
			borderRadius: '4px',
			fontWeight: 'bold',
			fontSize: '12px',
			padding: '1rem',
			textTransform: 'uppercase',
			textAlign: 'center',
		},
		// dimensions: { width: 80, ratio: 1 },
		content: 'pause',
	},

	listen: [
		{ event: 'go', action: 'enter' },
		{ ns: TC, event: 'play', action: 'play' },
		{ ns: TC, event: 'pause', action: 'pause' },
	],
	actions: [
		{
			name: 'enter',
			move: { layer: 'grid-01', slot: 'grid-01_s05' },
		},
		{
			name: 'play',
			content: 'pause',
		},
		{
			name: 'pause',
			content: 'play',
		},
	],

	emit: {
		click: {
			event: { ns: STRAP, name: TOGGLE },
			data: {
				id: 'telco',
				ns: TC,
				valueA: PAUSE,
				valueB: PLAY,
			},
		},
	},
};

console.log(actions);

export function transforms(story: any) {
	console.log('yaml res:', JSON.stringify(story, null, 4));
	return story;
}
