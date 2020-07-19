import { SHORT_STYLES } from "../../data/constantes";

// FIXME Plein d'erreurs : s'il le faut, traiter au niveau de la source, pas dans le composant.
export function removeAliasProps(store) {
  const newStore = {};
  for (const prop in store) {
    const key = SHORT_STYLES[prop] || prop;
    newStore[key] = store[prop];
  }
  console.log("removeAliasProps store", store);
  console.log("removeAliasProps newStore", newStore);
  return newStore;
}
