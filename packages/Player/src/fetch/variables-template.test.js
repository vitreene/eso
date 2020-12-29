import { pipapo } from './variables-template';

describe('remplace des valeurs entre accolades', () => {
	test('replace values in array', () => {
		const template = '{0}{1}';
		const data = ['!', '#'];
		const res = '!#';
		expect(pipapo(template, data)).toStrictEqual(res);
	});
	test('nested values', () => {
		const template = '{foo}{deeply.nested.valueFoo}';
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
