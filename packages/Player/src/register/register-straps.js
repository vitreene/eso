import addEventList from '../straps/add-event-list';

import { moveStrap } from '../straps/move-strap';
import Drag from '../straps/drag-strap';
import toggle from '../straps/toggle';

import GameStrap from '../straps/game-logic-strap';
import { MinuteurStrap } from '../straps/minuteur';

/* 
Par composition, ajouter aux straps :
- raz du state,
- pause /play
- stop(id)
-> la gestion du play/pause est passée à clock
*/

import { STRAP, TOGGLE, DRAG, MOVE } from '../data/constantes';

export function registerStraps(chrono, timeLiner, emitter) {
	emitter.on([STRAP, 'add-event-list'], (data) =>
		addEventList(data, chrono, timeLiner)
	);

	const DragStrap = Drag(emitter);
	emitter.on([STRAP, DRAG], (data) => new DragStrap(data));
	const Move = moveStrap(emitter);
	emitter.on([STRAP, MOVE], (data) => new Move(data));
	const toggleStrap = toggle(emitter);
	emitter.on([STRAP, TOGGLE], (data) => toggleStrap(data));

	const Game = GameStrap(emitter);
	emitter.on([STRAP, Game.name.toLowerCase()], (data) => new Game(data));
	const Minuteur = MinuteurStrap(chrono, emitter);
	emitter.on(
		[STRAP, Minuteur.name.toLowerCase()],
		(data) => new Minuteur(data)
	);
}
