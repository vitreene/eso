import { DEFAULT_NS, STRAP } from '../data/constantes';

/* 
TODO :
ajouter des slots aux cibles
targets doit posséder un layer et un id slot 
(->vérifier si un slot n'a pas un nom unique ?)

*/

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
    // TODO une seule cible à la construction
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
      emitter.emit([DEFAULT_NS, 'moveCard_' + this.source]);

      emitter.once([STRAP, 'end_' + data.event], this.endDrag);
      emitter.on([STRAP, 'guard_hover'], this.guard_hover);
    }
    endDrag = (d) => {
      console.log('END DRAG', d);
      console.log('d.target', d.target);
      console.log(' this.source,', this.source);

      emitter.off([STRAP, 'guard_hover'], this.guard_hover);

      const win = this.targets.includes(d.target);
      win && console.log('WIN !', d.target);

      win
        ? emitter.emit([DEFAULT_NS, 'dropCard_' + this.source], {
            move: { layer: 'casual', slot: 'casual_s03' },
            transition: { to: { left: 0, top: 0 } },
          })
        : emitter.emit([DEFAULT_NS, 'dropCard_' + this.source], {
            transition: {
              to: {
                left: d.initialElPosition.x,
                top: d.initialElPosition.y,
                backgroundColor: 'red',
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
