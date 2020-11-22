//TODO distinguer la portée de l'action: all - words - letters - lines
// séparer les objets de configuration, y intégrer portee
export const tinyEffectsPresets = {
	fade: {
		portee: 'all',
		presets: [
			{
				id: 'old',
				interpolation: {
					from: { opacity: 1, scale: 1 },
					to: { opacity: 0, scale: 0 },
					duration: 600,
				},
			},
			{
				id: 'current',
				interpolation: {
					from: { opacity: 0 },
					to: { opacity: 1 },
					duration: 600,
				},
			},
		],
	},
	'letters-top-down': {
		stagger: 30,
		portee: 'letters',
		presets: [
			{
				id: 'old',
				interpolation: {
					from: { color: 'crimson', opacity: 1, scale: 1, y: 0 },
					to: { color: 'white', opacity: 0, scale: 0, y: 100 },
					duration: 1500,
				},
			},
			{
				id: 'current',
				interpolation: {
					from: { color: 'darkblue', opacity: 0, y: -100 },
					to: { color: 'crimson', opacity: 1, y: 0 },
					duration: 800,
				},
			},
		],
	},
};
