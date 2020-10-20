import { api } from 'sinuous';
/**
 * Proxy an event to hooked event handlers.
 * @this Node & { _listeners: { [name: string]: (ev: Event) => * } }
 * @type {(e: Event) => *}
 */
function eventProxy(e) {
  // eslint-disable-next-line fp/no-this
  return this._listeners && this._listeners[e.type](e);
}

/**
 * @type {(el: Node, name: string, value: (ev: Event?) => *) => void}
 */
const handleEvent = (el, name, value) => {
  name = name.slice(2).toLowerCase();
  if (value) {
    el.addEventListener(name, eventProxy);
  } else {
    el.removeEventListener(name, eventProxy);
  }

  (el._listeners || (el._listeners = {}))[name] = value;
};

/**
 * @typedef {(el: Node, value: *, name: string, isAttr: boolean?, isCss: boolean?) => void} hProperty
 * @type {hProperty}
 */
export function property(el, value, name, isAttr, isCss) {
  // eslint-disable-next-line eqeqeq
  if (value == null) return;
  if (!name || (name === 'attrs' && (isAttr = true))) {
    for (name in value) {
      property(el, value[name], name, isAttr, isCss);
    }
  } else if (name[0] === 'o' && name[1] === 'n' && !value.$o) {
    // Functions added as event handlers are not executed
    // on render unless they have an observable indicator.
    handleEvent(el, name, value);
  } else if (typeof value === 'function') {
    api.subscribe(() => {
      property(el, value.call({ el, name }), name, isAttr, isCss);
    });
  } else if (isCss) {
    el.style.setProperty(name, value);
    // donner la priorité à ce test pour eviter [Object object] si svg
  } else if (name === 'style') {
    if (typeof value === 'string') {
      el.style.cssText = value;
    } else {
      property(el, value, null, isAttr, true);
    }
  } else if (
    isAttr ||
    name.slice(0, 5) === 'data-' ||
    name.slice(0, 5) === 'aria-'
  ) {
    el.setAttribute(name, value);
  } else {
    if (name === 'class') name += 'Name';
    el[name] = value;
  }
}
