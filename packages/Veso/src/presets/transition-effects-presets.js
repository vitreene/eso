import { DEFAULT_DURATION } from '../shared/constantes';

export const effect = {
	fromLeft: {
		from: {
			opacity: 0,
			x: -250,
		},
		to: {
			opacity: 1,
			x: 0,
		},
		duration: DEFAULT_DURATION,
	},
	fromRight: {
		from: {
			opacity: 0,
			x: 250,
		},
		to: {
			opacity: 1,
			x: 0,
		},
		duration: DEFAULT_DURATION,
	},
	fadeIn: {
		from: {
			opacity: 0,
		},
		to: {
			opacity: 1,
		},
		duration: DEFAULT_DURATION,
	},
	fadeInScale: {
		from: {
			opacity: 0,
			scale: 0.2,
		},
		to: {
			opacity: 1,
			scale: 1,
		},
		duration: DEFAULT_DURATION,
	},
	fadeOut: {
		from: {
			opacity: 1,
		},
		to: {
			opacity: 0.15,
		},
		duration: DEFAULT_DURATION / 2,
	},
	fadeOutScale: {
		from: {
			opacity: 1,
			scale: 1,
		},
		to: {
			opacity: 0.15,
			scale: 0.25,
		},
		duration: DEFAULT_DURATION,
	},
	fadeOutScaleOut: {
		from: {
			opacity: 1,
		},
		to: {
			opacity: 0,
			scale: 2.5,
		},
		duration: DEFAULT_DURATION,
	},
	fadeIn2: {
		opacity: [{ 0: 0 }, { 100: 1 }, { duration: 1 }],
		scale: [{ 0: 0.9 }, { 100: 1 }, { duration: 1 }],
	},
	default: {
		duration: DEFAULT_DURATION,
	},
};
