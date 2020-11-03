import { DEFAULT_NS, STRAP } from '../../../Veso/src/helpers/constantes';

// comportements evalués au drop
// _win est remplacé par la cible voulue,
// default si la cible n'est pas atteinte

const targets = (id) => ({
	_start: () => ({
		event: [DEFAULT_NS, 'moveCard_' + id],
	}),
	_win: ({ target, index }) => () => {
		const slot = 'slot_' + target;
		return [
			{
				event: [DEFAULT_NS, 'winCard_' + id],
				data: {
					move: { layer: '', slot },
					dynStyle: {
						color: 'yellow',
					},
					transition: {
						to: { left: 0, top: 0, scale: 1 },
					},
				},
			},

			{
				event: [STRAP, 'game-turnDrop'],
				data: { index },
			},
		];
	},
	main: () => ({
		event: [DEFAULT_NS, 'idle_' + id],
		data: {
			transition: {
				to: { scale: 1 },
			},
		},
	}),
	default: (d) => ({
		event: [DEFAULT_NS, 'dropCard_' + id],
		data: {
			transition: {
				to: {
					left: d.initialElPosition.x,
					top: d.initialElPosition.y,
					backgroundColor: 'red',
				},
			},
		},
	}),
});

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
export default function GameStrap(emitter) {
	return class Game {
		state = {};
		constructor(data) {
			console.log('GAME data', data);

			this.turnDrag = this.turnDrag.bind(this);
			this.turnDrop = this.turnDrop.bind(this);

			this.state.hit = data.letters.map((l) => l !== '.');
			this.state.word = data.word.split('');
			this.state.allTargets = data.casses.map((c) => c.id);

			this._on();
		}

		init() {}
		play() {}

		turnDrag(data) {
			console.log('turnDrag data', data);
			// data.letter = e
			// data.index = 2
			// data.id = card_2_e

			const eventType = 'moveCard_';
			this.state.targets = targets(data.id);
			this._createTargets(data);

			emitter.emit([STRAP, 'drag'], {
				...data,
				event: eventType + data.id,
				targets: this.state.targets,
				allTargets: this.state.allTargets,
			});
		}
		turnDrop({ index }) {
			this.state.hit[index] = true;
			const hasWon = this.state.hit.reduce((a, c) => a && c, true);
			hasWon && this.win();
		}
		win() {
			console.log('VICTOIRE', this.state.word.join(''));
			emitter.emit([DEFAULT_NS, 'win']);
			this._off();
		}

		lost() {
			emitter.emit([DEFAULT_NS, 'lost']);
			this._off();
		}

		_on() {
			emitter.on([STRAP, 'game-turnDrag'], this.turnDrag);
			emitter.on([STRAP, 'game-turnDrop'], this.turnDrop);
		}
		_off() {
			emitter.off([STRAP, 'game-turnDrag'], this.turnDrag);
			emitter.off([STRAP, 'game-turnDrop'], this.turnDrop);
		}

		_createTargets({ letter }) {
			const radix = 'casse_';
			const point = '.';
			const indexes = [];
			this.state.word.forEach(
				(l, i) => l === letter && !this.state.hit[i] && indexes.push(i)
			);

			for (const index of indexes) {
				const target = radix + index + '_' + point;
				this.state.targets[target] = this.state.targets._win({
					target,
					letter,
					index,
				});
			}
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
