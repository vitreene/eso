import { ESO_Namespace, ESO_Lang, Perso } from '../../../types/initial';

const MAIN = ESO_Namespace.MAIN;
const TELCO = ESO_Namespace.TELCO;
const TC = ESO_Namespace.TELCO;
const PLAY = ESO_Namespace.PLAY;
const PAUSE = ESO_Namespace.PAUSE;
const STOP = ESO_Namespace.STOP;
const REWIND = ESO_Namespace.REWIND;
const STRAP = ESO_Namespace.STRAP;
const TEMPO = ESO_Namespace.TEMPO;
const TOGGLE = ESO_Namespace.TOGGLE;
const DEFAULT_NS = ESO_Namespace.MAIN;
const CONTAINER_ESO = ESO_Namespace.CONTAINER_ESO;

const FR = ESO_Lang.fr;
const EN = ESO_Lang.en;

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
	return story;
}
