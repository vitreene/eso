import { o, api } from 'sinuous';
const h = api.h;

export const storeNodes = new WeakMap();

export function createPerso(key, props) {
  const attributes = { content: o('') };
  for (const p in props) attributes[p] = o(props[p]);
  const Perso = Persos[key.perso];
  storeNodes.set(key, Perso(attributes));
  return attributes;
}

/* 
props permet de parser des propriétés à l'initialisation du composant
*/
function Bloc(props) {
  const { content, ...attrs } = props;
  return <div {...attrs}>{content}</div>;
}

const Persos = {
  bloc: Bloc,
};
