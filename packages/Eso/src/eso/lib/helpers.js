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
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

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

export const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key);

export function arrayToObject(arr) {
  const obj = {};
  try {
    arr.forEach((el) => (obj[el.id] = el));
  } catch (error) {
    return null;
  }
  return obj;
}

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

export function round(precision) {
  return function(value) {
    return Number(value.toFixed(precision));
  };
}
export const toFixed2 = round(2);

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
export const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
