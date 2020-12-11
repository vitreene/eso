import { MAIN } from '../data/constantes';
import { natureSetProperty, listenExpandProps } from './transform-persos';

test('perso get nature', () => {
	const initial = {};
	const perso = [
		{
			bloc: { initial },
		},
	];
	const _result = [{ nature: 'bloc', initial }];
	expect(natureSetProperty(perso)).toStrictEqual(_result);
});

describe('perso.listen', () => {
	const ns = MAIN;
	test('listen as string', () => {
		const listen = ['ev011'];
		// const _result = [{action: "play", event: "play",ns: "telco"}]
		const _result = [{ event: 'ev011', action: 'ev011', ns }];
		expect(listenExpandProps(listen)).toStrictEqual(_result);
	});

	test('listen as array', () => {
		const listen = [['ev011', 'play']];
		// const _result = [{action: "play", event: "play",ns: "telco"}]
		const _result = [{ event: 'ev011', action: 'play', ns }];
		expect(listenExpandProps(listen)).toStrictEqual(_result);
	});

	test('listen default ns', () => {
		const listen = [{ event: 'ev011', action: 'play' }];
		const _result = [{ event: 'ev011', action: 'play', ns }];
		expect(listenExpandProps(listen)).toStrictEqual(_result);
	});
	test('listen complete', () => {
		const listen = [
			{ ev011: 'enter' },
			{ ev012: 'step02' },
			{ ev013: 'step03' },
			'ev014',
			'ev015',
		];
		const _result = [
			{ ns: MAIN, event: 'ev011', action: 'enter' },
			{ ns: MAIN, event: 'ev012', action: 'step02' },
			{ ns: MAIN, event: 'ev013', action: 'step03' },
			{ ns: MAIN, event: 'ev014', action: 'ev014' },
			{ ns: MAIN, event: 'ev015', action: 'ev015' },
		];
		expect(listenExpandProps(listen)).toStrictEqual(_result);
	});
});
