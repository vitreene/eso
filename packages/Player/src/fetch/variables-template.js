// https://github.com/sindresorhus/pupa/blob/master/index.js

/* 
créer une version qui traverse un objet à la recherche de variable, consigne les strings trouvées et leur chemin, pour les réappliquer dans une map
*/

export const pipapo = (template, data) => {
	if (typeof template !== 'string') {
		throw new TypeError(
			`Expected a \`string\` in the first argument, got \`${typeof template}\``
		);
	}

	if (typeof data !== 'object') {
		throw new TypeError(
			`Expected an \`object\` or \`Array\` in the second argument, got \`${typeof data}\``
		);
	}

	const braceRegex = /{(\d+|[a-z$_][a-z\d$_]*?(?:\.[a-z\d$_]*?)*?)}/gi;

	return template.replace(braceRegex, (_, key) => {
		let result = data;

		for (const property of key.split('.')) {
			result = result ? result[property] : '';
		}

		return String(result);
	});
};
