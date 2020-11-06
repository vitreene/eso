import { CONTAINER_ESO } from '../../data/constantes';

// ============================================================
// LAYERS
// ============================================================
const root = {
	id: CONTAINER_ESO,
	nature: 'layer',
	initial: {
		className: 'container',
		content: [
			{
				id: 's01',
				statStyle: {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'grid',
					gridColumn: 1,
					gridRow: 1,
				},
			},
		],
	},
	// listen: [{ event: "init", action: "enter" }],
};

const casual = {
	id: 'casual',
	nature: 'layer',
	initial: {
		style: { background: '#ff00ee' },
		className: 'casual',
		content: [
			{ id: 's01', statStyle: { gridRow: 1 } },
			{ id: 's02', statStyle: { gridRow: 2 } },
			{ id: 's03', statStyle: { gridRow: 3 } },
			{ id: 's04', statStyle: { gridRow: 4 } },
		],
	},
	listen: [{ event: 'start', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
			order: 1,
		},
	],
};

const plateau = {
	id: 'plateau',
	nature: 'layer',
	initial: {
		className: 'plateau',
		content: [
			{
				id: 's01',
				className: 'plateau-slot',
				statStyle: { justifyContent: 'center', alignItems: 'center' },
			},
		],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s03' },
			order: 1,
		},
	],
};

const presentoir = {
	id: 'presentoir',
	nature: 'layer',
	initial: {
		dimensions: {
			width: '80%',
		},
		className: 'presentoir',
		content: [{ id: 's01' }],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s02' },
			order: 1,
		},
	],
};

const sabot = {
	id: 'sabot',
	nature: 'layer',
	initial: {
		dimensions: { width: '80%' },
		className: 'sabot',
		content: [{ id: 's01', statStyle: { gridRow: 1 } }],
	},
	listen: [{ event: 'go', action: 'enter' }],
	actions: [
		{
			name: 'enter',
			move: { layer: 'casual', slot: 'casual_s04' },
			order: 1,
		},
	],
};

const empty = {
	id: '',
	nature: '',
	initial: {},
	listen: [],
	actions: [],
	emit: {},
};

export const layers = [root, casual, plateau, presentoir, sabot];
