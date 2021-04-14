export function parseVariables(template: unknown, data: unknown) {
	const clone = deepClone(template);
	return parse(clone);

	function parse(tpl) {
		if (typeof tpl === 'object') {
			if (Array.isArray(tpl)) {
				tpl = tpl.map(parse);
			} else {
				for (const t in tpl) tpl[t] = parse(tpl[t]);
			}
		} else if (typeof tpl === 'string') tpl = pipapo(tpl, data);

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

	const res = template.replace(braceRegex, (_, key) => {
		let result = data;
		for (const property of key.split('.')) {
			result = result ? result[property] : '';
		}
		return String(result);
	});
	return res;
};

function deepClone(obj, hash = new WeakMap()) {
	if (Object(obj) !== obj) return obj; // primitives
	if (hash.has(obj)) return hash.get(obj); // cyclic reference
	const result =
		obj instanceof Set
			? new Set(obj) // See note about this!
			: obj instanceof Map
			? new Map(Array.from(obj, ([key, val]) => [key, deepClone(val, hash)]))
			: obj instanceof Date
			? new Date(obj)
			: obj instanceof RegExp
			? new RegExp(obj.source, obj.flags)
			: // ... add here any specific treatment for other classes ...
			// and finally a catch-all:
			obj.constructor
			? new obj.constructor()
			: Object.create(null);
	hash.set(obj, result);
	return Object.assign(
		result,
		...Object.keys(obj).map((key) => ({ [key]: deepClone(obj[key], hash) }))
	);
}
