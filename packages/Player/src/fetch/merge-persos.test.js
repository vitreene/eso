import { MAIN } from '../data/constantes';
import { mergePersos, merge } from './merge-persos';

describe('merge deux persos', () => {
	test('merge style', () => {
		const _proto = proto.initial.classStyle;
		const _text = text.initial.classStyle;
		const _result = result.initial.classStyle;
		expect(merge.style(_proto, _text)).toStrictEqual(_result);
	});

	test('merge classNames', () => {
		const _proto = proto.initial.className;
		const _text = text.initial.className;
		const _result = result.initial.className;
		expect(merge.className(_proto, _text)).toStrictEqual(_result);
	});

	test('combine classNames', () => {
		const _proto = 'proto';
		const _rm = '-=proto text';
		const _result_rm = 'text';
		const _tg = ':=proto text';
		const _result_tg = 'text';
		const _add = '+=add text';
		const _result_add = 'proto add text';
		const _uniq = '/=text';
		const _result_uniq = 'text';
		expect(merge.className(_proto, _rm)).toStrictEqual(_result_rm);
		expect(merge.className(_proto, _tg)).toStrictEqual(_result_tg);
		expect(merge.className(_proto, _add)).toStrictEqual(_result_add);
		expect(merge.className(_proto, _uniq)).toStrictEqual(_result_uniq);
	});

	test('initial merge', () => {
		expect(merge.initial(proto.initial, text.initial)).toStrictEqual(
			result.initial
		);
	});

	test('actions merge', () => {
		expect(merge.actions(proto.actions, text.actions)).toStrictEqual(
			result.actions
		);
	});

	test('listen merge', () => {
		const _proto = [
			{ channel: MAIN, event: 'go', action: 'enter' },
			{ channel: MAIN, event: 'commence', action: 'tutu' },
			{ channel: MAIN, event: 'end', action: 'leave' },
		];
		const _text = [
			{ channel: 'strap', event: 'go', action: 'enter' },
			{ channel: MAIN, event: 'continue', action: 'toto' },
			{ channel: MAIN, event: 'end', action: 'leave' },
		];
		const _result = [
			{ channel: MAIN, event: 'go', action: 'enter' },
			{ channel: MAIN, event: 'commence', action: 'tutu' },
			{ channel: 'strap', event: 'go', action: 'enter' },
			{ channel: MAIN, event: 'continue', action: 'toto' },
			{ channel: MAIN, event: 'end', action: 'leave' },
		];
		expect(merge.listen(_proto, _text)).toStrictEqual(_result);
	});

	test('total merge', () => {
		expect(merge.persos(proto, text)).toStrictEqual(result);
	});
});

describe('chain deep merge', () => {
	test('deep', () => {
		const { initial, actions } = proto;
		const _p1 = { id: 'p1', nature: 'proto', initial };
		const _p2 = { id: 'p2', nature: 'proto', extends: 'p1', actions };
		const _ref = { extends: 'p2', ...text };
		const res = mergePersos([_p1, _p2, _ref]);
		expect(res[2]).toStrictEqual(result);
	});
});

/* 
placer des listen sur proto peut créer des contraintes trop fortes
ex. tous les éléments hérités commencent en meme temps
- soit accepter des surcharges : sur l'event ? sur l'action ?
- soit mettre un mécanisme de retrait -> illogique : ne pas lutter contre une config
*/
const proto = {
	id: 'proto',
	nature: 'bloc',
	initial: {
		className: 'center',
		classStyle: {
			backgroundColor: 'blue',
			color: 'yellow',
		},
		content: 'test',
	},
	actions: [
		{ name: 'enter', enter: true, transition: { to: 'fadeIn' } },
		{ name: 'leave', leave: true, transition: { to: 'fadeOut' } },
	],
};
const text = {
	id: 'text',
	nature: 'bloc',
	initial: {
		className: 'ornament',
		classStyle: {
			backgroundColor: 'red',
			fontSize: '32px',
		},
		content: 'nouveau',
	},
	listen: [
		{ channel: MAIN, event: 'go', action: 'enter' },
		{ channel: MAIN, event: 'end', action: 'leave' },
	],
	actions: [{ name: 'enter', move: { slot: 'so1' } }],
};

const result = {
	id: 'text',
	nature: 'bloc',
	initial: {
		className: 'center ornament',
		classStyle: {
			color: 'yellow',
			backgroundColor: 'red',
			fontSize: '32px',
		},
		content: 'nouveau',
	},
	listen: [
		{ channel: MAIN, event: 'go', action: 'enter' },
		{ channel: MAIN, event: 'end', action: 'leave' },
	],
	actions: [
		{
			name: 'enter',
			enter: true,
			transition: { to: 'fadeIn' },
			move: { slot: 'so1' },
		},
		{ name: 'leave', leave: true, transition: { to: 'fadeOut' } },
	],
};
