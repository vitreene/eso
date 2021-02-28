export function parseVariables(template: unknown, data: unknown) {
	return parse(template);

	function parse(tpl) {
		if (typeof tpl === 'object') {
			if (Array.isArray(tpl)) {
				for (let t of tpl) t = parse(t);
			} else {
				for (let t in tpl) tpl[t] = parse(tpl[t]);
			}
		}
		if (typeof tpl === 'string') tpl = pipapo(tpl, data);
		return tpl;
	}
}

// https://github.com/sindresorhus/pupa/blob/master/index.js

/* 
créer une version qui traverse un objet à la recherche de variable, consigne les strings trouvées et leur chemin, pour les réappliquer dans une map
*/

export const pipapo = (template: unknown, data: unknown) => {
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
	// "take my ${variable} et ma ${deux.ieme} test"
	const braceRegex = /\${(\d+|[a-z$_][a-z\d$_]*?(?:\.[a-z\d$_]*?)*?)}/gi;

	return template.replace(braceRegex, (_, key) => {
		let result = data;

		for (const property of key.split('.')) {
			result = result ? result[property] : '';
		}

		return String(result);
	});
};
