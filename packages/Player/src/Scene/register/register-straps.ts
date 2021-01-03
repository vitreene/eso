import { emitter } from '../../App/emitter';

import { moveStrap } from '../../straps/move-strap';
import Drag from '../../straps/drag-strap';
import toggle from '../../straps/toggle';

import GameStrap from '../../straps/game-logic-strap';
import Minuteur from '../../straps/minuteur';

import { STRAP, TOGGLE, DRAG, MOVE } from '../../data/constantes';

/* 
Par composition, ajouter aux straps :
- raz du state,
- pause /play
- stop(id)
-> la gestion du play/pause est passée à clock
*/

/* 
les straps peuvent ils etre instanciées ou doivent-ils etre uniques ?
- si instanciés, doivent etre appelés par un emitter distinct
- sinon, doivent tenir un state distinct : envoyer une key comme identifiant à chaque appel.
key est donc soit par appel, soit à la création d'instance.
créer un cas réel.
*/

export function registerStraps(): void {
	/* 
	trouver une meilleure façon d'initialiser les strap 
	ne pourrait-on  pas importer directement emitter dans chaque strap ?
	*/
	const DragStrap = Drag(emitter);
	emitter.on([STRAP, DRAG], (data) => new DragStrap(data));
	const Move = moveStrap(emitter);
	emitter.on([STRAP, MOVE], (data) => new Move(data));
	const toggleStrap = toggle(emitter);
	emitter.on([STRAP, TOGGLE], (data) => toggleStrap(data));

	const Game = GameStrap(emitter);
	emitter.on([STRAP, Game.name.toLowerCase()], (data) => new Game(data));

	emitter.on(
		[STRAP, Minuteur.name.toLowerCase()],
		(data) => new Minuteur(data)
	);
}
