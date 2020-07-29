import { o, api } from "sinuous";
const h = api.h;

export const storeNodes = new WeakMap();

export function createPerso(key, tag, props) {
	const attributes = { content: o("") };
	for (const p in props) attributes[p] = o(props[p]);
	const Perso = Persos[key.perso];
	storeNodes.set(key, Perso({ tag, ...attributes }));
	return attributes;
}

export function getComputedStyle(uuid) {
	const node = storeNodes.get(uuid);
	return window ? window.getComputedStyle(node) : null;
}
/* 
props permet de parser des propriétés à l'initialisation du composant
*/
function bloc(props) {
	const { tag = "div", content = "", ...attrs } = props;
	return h(tag, attrs, content);
}

const Persos = {
	bloc,
};

/* 
reunir le rendu et la definition ensemble comme un composant de type React.
le "render" de Eso doit-il etre renommé ?
commit ? 
rapprocher render.js de createperso.js
*/
