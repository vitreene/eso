import { MAIN } from '../data/constantes';
import {
	natureSetProperty,
	listenExpandProps,
	actionsToArray,
	moveExpandProps,
	listenCollectAll,
} from './transform-persos';

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
	const channel = MAIN;
	const expandProps = listenExpandProps(channel);
	test('listen as string', () => {
		const listen = ['ev011'];
		// const _result = [{action: "play", event: "play",channel: "telco"}]
		const _result = [{ event: 'ev011', action: 'ev011', channel }];
		expect(expandProps(listen)).toStrictEqual(_result);
	});

	test('listen as array', () => {
		const listen = [['ev011', 'play']];
		// const _result = [{action: "play", event: "play",channel: "telco"}]
		const _result = [{ event: 'ev011', action: 'play', channel }];
		expect(expandProps(listen)).toStrictEqual(_result);
	});

	test('listen default channel', () => {
		const listen = [{ event: 'ev011', action: 'play' }];
		const _result = [{ event: 'ev011', action: 'play', channel }];
		expect(expandProps(listen)).toStrictEqual(_result);
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
			{ channel: MAIN, event: 'ev011', action: 'enter' },
			{ channel: MAIN, event: 'ev012', action: 'step02' },
			{ channel: MAIN, event: 'ev013', action: 'step03' },
			{ channel: MAIN, event: 'ev014', action: 'ev014' },
			{ channel: MAIN, event: 'ev015', action: 'ev015' },
		];
		expect(expandProps(listen)).toStrictEqual(_result);
	});

	test('listen add actions', () => {
		const listen = [{ channel: MAIN, event: 'ev011', action: 'enter' }];
		const actions = [{ name: 'leave' }];
		const _results = [
			{ channel: MAIN, event: 'ev011', action: 'enter' },
			{ channel: MAIN, event: 'leave', action: 'leave' },
		];
		expect(listenCollectAll(channel, actions)(listen)).toStrictEqual(_results);
	});
});

describe('perso actions', () => {
	test('actionsToArray', () => {
		const actions = {
			enter: { dimensions: { width: '100%', height: '100%' } },
		};
		const _result = [
			{ name: 'enter', dimensions: { width: '100%', height: '100%' } },
		];
		expect(actionsToArray(actions)).toStrictEqual(_result);
	});

	test('moveExpandProps', () => {
		const actions = [{ name: 'enter', move: 's01' }];
		const _result = [{ name: 'enter', move: { slot: 's01' } }];
		expect(moveExpandProps(_result)).toStrictEqual(_result);
		expect(moveExpandProps(actions)).toStrictEqual(_result);
	});
});
