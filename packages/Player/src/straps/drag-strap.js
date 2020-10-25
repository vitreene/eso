import { DEFAULT_NS, STRAP } from '../data/constantes';

/* 
 - definir les cibles -> attribuer une réaction
 faut-il définir les réactions à la volée (et comment ?)
 il n'est pas prévu d'attacher un event dynamiquement.
 ou bien les placer à l'init et n'en tenir compte qu'au besoin ?
 placer des écouteurs 
 - drop : renvoyer la cible
  */
const defaultCallback = () => console.log('callback');

export default function dragStrap(emitter) {
  return class Drag {
    constructor(data, targets = ['casse_4_.', 'casse_3_.', 'casse_2_.'], cb) {
      this.source = data.id;
      this.targets = targets;
      this.currentTarget = null;
      this.cb = cb || defaultCallback;
      this.startDrag(data);
    }

    startDrag(data) {
      console.log('ma DRAG', data);
      emitter.emit([STRAP, 'move'], data);
      emitter.once([STRAP, 'end_' + data.event], this.endDrag);
      emitter.emit([DEFAULT_NS, 'moveCard_' + this.source]);

      emitter.on([STRAP, 'guard_hover'], this.guard_hover);
    }
    endDrag = (d) => {
      console.log('END DRAG', d);
      console.log('d.target', d.target);
      console.log(' this.source,', this.source);

      this.targets.includes(d.target) && console.log('WIN !', d.target);
      emitter.off([STRAP, 'guard_hover'], this.guard_hover);

      console.log('DROP---_>', d.initialElPosition);
      emitter.emit([DEFAULT_NS, 'dropCard_' + this.source], {
        transition: {
          to: {
            left: d.initialElPosition.x,
            top: d.initialElPosition.y,
            // backgroundColor: 'red',
          },
        },
      });
      // emitter.emit([DEFAULT_NS, 'dropCard_' + this.source]);

      this.cb();
    };

    guard_hover = ({ leave, hover }) => {
      console.log('{ leave, hover }', { leave, hover });
      this.targets.includes(leave) &&
        emitter.emit([DEFAULT_NS, 'leave_' + leave]);
      this.targets.includes(hover) &&
        emitter.emit([DEFAULT_NS, 'hover_' + hover]);
    };
  };
}
