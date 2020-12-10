import { eventimesStartAt } from './transform-eventimes';
import { eventimes } from '../stories/story01/story-01-eventimes';

describe('eventimes', () => {
	test('eventimes startAt', () => {
		const _eventimes = {
			0: {
				name: 'start',
				events: {
					0: { name: 'go', data: ['un', 'deux', 'trois'] },
					500: 'ev011',
					1000: 'ev012',
					2000: 'ev013',
					3000: 'ev014',
					4000: 'ev015',
					5000: {
						name: 'leave-root',
						events: { 1000: { name: 'bye', data: ['quatre', 'cinq', 'six'] } },
					},
				},
			},
		};

		const _results = eventimes;
		expect(eventimesStartAt(_eventimes)).toStrictEqual(_results);
	});

	test('array eventimes', () => {
		const _eventimes = {
			0: ['ev011', 'ev012'],
		};

		const _results = [
			{ startAt: 0, name: 'ev011' },
			{ startAt: 0, name: 'ev012' },
		];

		expect(eventimesStartAt(_eventimes)).toStrictEqual(_results);

		const _eventimes02 = {
			0: ['ev011', { name: 'go', data: ['un', 'deux', 'trois'] }],
		};
		const _results02 = [
			{ startAt: 0, name: 'ev011' },
			{ startAt: 0, name: 'go', data: ['un', 'deux', 'trois'] },
		];
		expect(eventimesStartAt(_eventimes02)).toStrictEqual(_results02);
	});
});
