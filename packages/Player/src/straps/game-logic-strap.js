import { joinId } from '../shared/utils';
import { DEFAULT_NS, STRAP } from '../data/constantes';

// comportements evalués au drop
// _win est remplacé par la cible voulue,
// default si la cible n'est pas atteinte
/* 
TODO utiliser init pour créer les elements et play pour demarrer le jeu
- comment effacer les persos créés en fin de jeu
- timer 
- animation de debut, win et lost
- bouton jouer
- bouton rejouer
- design du jeu
- choix de difficulté

*/

const target = 'casse';
const point = '.';

export default function GameStrap(emitter) {
	return class Game {
		hit;
		word;
		targets;
		allTargets;

		constructor(data) {
			console.log('GAME data', data);
			// this.win = this.win.bind(this);
			// this._on = this._on.bind(this);
			// this._off = this._off.bind(this);
			this.lost = this.lost.bind(this);
			this.turnDrag = this.turnDrag.bind(this);
			this.turnDrop = this.turnDrop.bind(this);

			this.hit = data.letters.map((l) => l !== '.');
			this.word = data.word.split('');
			this.allTargets = data.casses.map((c) => c.id);
			this._on();
		}

		init() {}
		play() {}

		turnDrag(data) {
			// emitter.emit([DEFAULT_NS, 'card-auto-move_' + data.id]);
			// console.log('turnDrag data', data);
			// data.letter = e
			// data.index = 2
			// data.id = card_2_e

			//TODO cancel drag
			// emitter.emit([STRAP, 'move-cancel']);

			const event = joinId('moveCard', data.id);
			// this.targets = targets(data.id);
			this.targets = data.targetActions;
			this._createTargets(data);

			emitter.emit([STRAP, 'drag'], {
				...data,
				event,
				targets: this.targets,
				allTargets: this.allTargets,
			});
		}
		turnDrop({ index }) {
			this.hit[index] = true;
			const hasWon = this.hit.reduce((a, c) => a && c, true);
			hasWon && this.win();
		}
		win() {
			console.log('VICTOIRE', this.word.join(''));

			emitter.emit([STRAP, 'minuteur-stop']);
			emitter.emit([DEFAULT_NS, 'win']);
			this._off();
		}

		lost() {
			emitter.emit([DEFAULT_NS, 'lost']);
			// TODO animer la réponse : les  lettres rejoignent leur case
			this._off();
		}

		_on() {
			emitter.on([STRAP, 'game-turnDrag'], this.turnDrag);
			emitter.on([STRAP, 'game-turnDrop'], this.turnDrop);
			emitter.on([STRAP, 'game-lost'], this.lost);
		}
		_off() {
			emitter.off([STRAP, 'game-turnDrag'], this.turnDrag);
			emitter.off([STRAP, 'game-turnDrop'], this.turnDrop);
			emitter.off([STRAP, 'game-lost'], this.lost);
		}

		_createTargets({ letter }) {
			const indexes = [];
			this.word.forEach(
				(l, i) => l === letter && !this.hit[i] && indexes.push(i)
			);

			for (const index of indexes) {
				const targetLetter = joinId(target, index, point);
				this.targets[targetLetter] = this.targets._win({
					targetLetter,
					letter,
					index,
				});
			}
		}
		// rassemble les dernières lettres pour donner la solution
		endPlay() {
			/* 
			
			*/
		}
	};
}

/* 
turnDrag est appellé pour configurer Drag
- selectionner les cibles
- retirer les cibles dejà occupées 
- si la carte est déjà placée, interdire son déplacement
-> ou delete l'action avant ?

state : 
la logique d'avancement du jeu
- le mot
- les lettres card
- les lettres casse
génère :
- les cibles disponibles


*/
