import { natureSetProperty } from './transform-persos';

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
