import { MAIN, STRAP } from "../../data/constantes";

export function registerKeyEvents(emit, emitter) {
  if (!emit) return null;
  const keyEvents = {};

  const emitEvent = ({ event: { ns = MAIN, name }, data }, args) => {
    // const e = ns === STRAP ? args : null;
    // console.log("e, ns, name, data, target", e, ns, name, data, target);
    emitter.emit([ns, name], { ...data, ...(ns === STRAP && args) } || name);
  };
  for (const event in emit)
    keyEvents[event] = args => emitEvent(emit[event], args);

  return keyEvents;
}
