import { MAIN } from '../data/constantes';
import { merge } from './merge';

describe('merge deux persos', () => {
	test('merge style', () => {
		const _proto = proto.initial.statStyle;
		const _text = text.initial.statStyle;
		const _result = result.initial.statStyle;
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
			{ ns: MAIN, event: 'go', action: 'enter' },
			{ ns: MAIN, event: 'commence', action: 'tutu' },
			{ ns: MAIN, event: 'end', action: 'leave' },
		];
		const _text = [
			{ ns: 'strap', event: 'go', action: 'enter' },
			{ ns: MAIN, event: 'continue', action: 'toto' },
			{ ns: MAIN, event: 'end', action: 'leave' },
		];
		const _result = [
			{ ns: MAIN, event: 'go', action: 'enter' },
			{ ns: MAIN, event: 'commence', action: 'tutu' },
			{ ns: 'strap', event: 'go', action: 'enter' },
			{ ns: MAIN, event: 'continue', action: 'toto' },
			{ ns: MAIN, event: 'end', action: 'leave' },
		];
		expect(merge.listen(_proto, _text)).toStrictEqual(_result);
	});
	// test('total merge', () => {
	// 	expect(merge(proto, text)).toStrictEqual(result);
	// });
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
		statStyle: {
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
		statStyle: {
			backgroundColor: 'red',
			fontSize: '32px',
		},
		content: 'nouveau',
	},
	listen: [
		{ ns: MAIN, event: 'go', action: 'enter' },
		{ ns: MAIN, event: 'end', action: 'leave' },
	],
	actions: [{ name: 'enter', move: { slot: 'so1' } }],
};

const result = {
	id: 'text',
	nature: 'bloc',
	initial: {
		className: 'center ornament',
		statStyle: {
			color: 'yellow',
			backgroundColor: 'red',
			fontSize: '32px',
		},
		content: 'nouveau',
	},
	listen: [
		{ ns: MAIN, event: 'go', action: 'enter' },
		{ ns: MAIN, event: 'end', action: 'leave' },
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
