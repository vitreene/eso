import { DEFAULT_NS, STRAP } from "../data/constantes";

/* 
 - definir les cibles -> attribuer une réaction
 faut-il définir les réactions à la volée (et comment ?)
 il n'est pas prévu d'attacher un event dynamiquement.
 ou bien les placer à l'init et n'en tenir compte qu'au besoin ?
 placer des écouteurs 
 - drop : renvoyer la cible
  */
const defaultCallback = () => console.log("callback");

export default function dragStrap(emitter) {
  return class Drag {
    constructor(data, targets = ["casse_4_.", "casse_3_.", "casse_2_."], cb) {
      this.source = data.id;
      this.targets = targets;
      this.currentTarget = null;
      this.cb = cb || defaultCallback;
      this.startDrag(data);
    }

    startDrag(data) {
      console.log("ma DRAG", data);
      emitter.emit([STRAP, "move"], data);
      emitter.once([STRAP, "end_" + data.event], this.endDrag);

      emitter.on([STRAP, "guard_hover"], this.guard_hover);
    }
    endDrag = (d) => {
      console.log("end drag", d.target, this.source, d);
      this.targets.includes(d.target) && console.log("WIN !", d.target);
      emitter.off([STRAP, "guard_hover"], this.guard_hover);

      emitter.emit([DEFAULT_NS, "dropCard_" + this.source]);
      this.cb();
    };

    guard_hover = ({ leave, hover }) => {
      this.targets.includes(leave) &&
        emitter.emit([DEFAULT_NS, "leave_" + leave]);
      this.targets.includes(hover) &&
        emitter.emit([DEFAULT_NS, "hover_" + hover]);
    };
  };
}
