import { pipapo, parseVariables } from './variables-template';

describe('remplace des valeurs entre accolades', () => {
	test('replace values in array', () => {
		const template = '${0}${1}';
		const data = ['!', '#'];
		const res = '!#';
		expect(pipapo(template, data)).toStrictEqual(res);
	});
	test('nested values', () => {
		const template = '${foo}${deeply.nested.valueFoo}';
		const data = {
			foo: '!',
			deeply: {
				nested: {
					valueFoo: '#',
				},
			},
		};
		const res = '!#';
		expect(pipapo(template, data)).toStrictEqual(res);
	});
});

describe('parse variables', () => {
	test('use template', () => {
		const template = 'un,${deux},${trois},quatre';
		const datas = { deux: 2, trois: 3 };
		const res = 'un,2,3,quatre';
		expect(parseVariables(template, datas)).toStrictEqual(res);
	});
	test('use data nested', () => {
		const template = 'un,${deux},${trois.et.demi},quatre';
		const datas = { deux: 2, trois: { et: { demi: 3.5 } } };
		const res = 'un,2,3.5,quatre';
		expect(parseVariables(template, datas)).toStrictEqual(res);
	});
	test('use template nested', () => {
		const template = { s0: { s1: 'un,${deux},${trois.et.demi},quatre' } };
		const datas = { deux: 2, trois: { et: { demi: 3.5 } } };
		const res = { s0: { s1: 'un,2,3.5,quatre' } };
		const exp = parseVariables(template, datas);
		console.log('exp', exp);
		expect(exp).toStrictEqual(res);
	});
});
