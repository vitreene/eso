import { o, api } from 'sinuous';
const h = api.h;

export const storeNodes = new WeakMap();

export function createPerso(key, props) {
  const attributes = { content: o('') };
  for (const p in props) attributes[p] = o(props[p]);
  storeNodes.set(key, Bloc(attributes));
  return { node: storeNodes.get(key), attributes };
}

function Bloc(props) {
  const { content, ...attrs } = props;
  return (
    <div {...attrs}>
      Compteur <b>{content}</b>
    </div>
  );
}
