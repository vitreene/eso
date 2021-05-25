export function throttle(callback, limit) {
	let wait = false; // Initially, we're not waiting
	return () => {
		// We return a throttled function
		if (!wait) {
			// If we're not waiting
			callback.call(); // Execute users function
			wait = true; // Prevent future invocations
			setTimeout(
				() =>
					// After a period of time
					(wait = false), // And allow future invocations
				limit
			);
		}
	};
}

export function debounce(func, wait, immediate) {
	let timeout;
	return function (...args) {
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

// est lu vrai la première fois, faux ensuite
export class TrueOnce {
	value = false;
	set on(v = true) {
		this.value = v;
	}
	get on() {
		const on = this.value;
		this.value = false;
		return on;
	}
}

export class GetSet {
	constructor(label, value = '') {
		this.label = label;
		let val = value;
		this[label] = {
			set(v) {
				val = v;
			},
			get() {
				return val;
			},
		};
	}
}

export function hasProperties(properties, style) {
	let flag = false;
	if (style) {
		for (const prop of properties) {
			if (hasOwn(style, prop)) {
				flag = true;
				break;
			}
		}
	}
	return flag;
}

// raccourci pour hasOwnProperty
export const hasOwn = (obj, key) =>
	Object.prototype.hasOwnProperty.call(obj, key);

// transforme un tableau en objet
export function arrayToObject(arr) {
	const obj = {};
	try {
		arr.forEach((el) => (obj[el.id] = el));
	} catch (error) {
		return null;
	}
	return obj;
}

// creer des noms composés
export function joinId(...args) {
	return args.filter((a) => a !== '').join('_');
}

export function isPlainObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

// ne teste pas la validité de obj
export function objToFixed(obj) {
	const r = {};
	for (const e in obj) r[e] = parseFloat(obj[e].toFixed(2));

	return r;
}

// nombres arrondis
export function round(precision) {
	return function (value) {
		return Number(value.toFixed(precision));
	};
}
export const toFixed2 = round(2);

// stocke une queue de fonctions
export const deferOnMount = {
	dequeue() {
		let exe;
		do {
			exe = this.exe;
			typeof exe === 'function' && exe();
		} while (exe !== 'empty');
	},
	values: [],
	set exe(fn) {
		this.values.push(fn);
	},
	get exe() {
		return this.values.length > 0 ? this.values.shift() : 'empty';
	},
};

// separe valeur et unités
const separate = /\s*(\d+)\s*(\D*)/;
export function splitUnitValue(val) {
	if (val === undefined) return null;
	if (typeof val === 'number') return { value: val, unit: null };
	const match = val.match(separate);
	return {
		value: match[1],
		unit: match[2],
	};
}

// pipe et compose
const execute = (v, f) => {
	return typeof f === 'function' ? f(v) : v;
};
export const compose =
	(...fns) =>
	(x) =>
		fns.reduceRight(execute, x);
export const pipe =
	(...fns) =>
	(x) =>
		fns.reduce(execute, x);

// true si null, undefined, ou ""
export function isVoid(x) {
	return !x && x !== 0;
}

// true si null ou undefined ('' -> false)
export function isNull(x) {
	return x == null;
}

// renvoie un tableau s'il n'en est pas un :
export function toArray(value) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

export function map(fn) {
	if (typeof fn !== 'function') throw new Error('une fonction est demandée');
	return function _map(arr) {
		if (!Array.isArray(arr)) throw new Error('un tableau est demandé');
		return arr.map(fn);
	};
}

export function logs(obj, message = '') {
	console.log('LOG %s', message, obj);
	return obj;
}

export const log = (message) => (props) => {
	console.log('transition %s --->', message, [...props.transition]);
	return props;
};
