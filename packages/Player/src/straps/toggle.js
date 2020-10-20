import { DEFAULT_NS } from "../data/constantes";
// TODO register toggle
// exemple button

export default function addEventList(emitter) {
  const toggles = {};
  return function(data) {
    const { id, ns = DEFAULT_NS, valueA, valueB, ...others } = data;

    const NS = Array.isArray(ns) ? ns : [ns];
    toggles[id] || (toggles[id] = valueB);
    toggles[id] === valueB ? (toggles[id] = valueA) : (toggles[id] = valueB);
    NS.forEach(ns => emitter.emit([ns, toggles[id]], others));
  };
}
