import { moveStrap } from '../straps/move-strap';
import Drag from '../straps/drag-strap';
import toggle from '../straps/toggle';
import addEventList from '../straps/add-event-list';

/* 
Par composition, ajouter aux straps :
- raz du state,
- pause /play
- stop(id)
-> la gestion du play/pause est passée à clock
*/

import { STRAP, TOGGLE } from '../data/constantes';

export function registerStraps(chrono, timeLiner, emitter) {
  const DragStrap = Drag(emitter);
  emitter.on([STRAP, 'drag'], (data) => new DragStrap(data));
  const Move = moveStrap(emitter);
  emitter.on([STRAP, 'move'], (data) => new Move(data));
  const toggleStrap = toggle(emitter);
  emitter.on([STRAP, TOGGLE], (data) => toggleStrap(data));

  emitter.on([STRAP, 'add-event-list'], (data) =>
    addEventList(data, chrono, timeLiner)
  );
}
