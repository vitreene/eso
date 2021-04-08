import { nanoid } from 'nanoid';
import { Tweenable } from 'shifty';

import { DEFAULT_DURATION } from './constantes';

// tween({
//   from: 0,
//   to: { x: 300, rotate: 180 },
//   duration: 1000,
//   ease: easing.backOut,
//   flip: Infinity
// })

/* 
 TODO
 les interpolations doivent etre découpées selon leur durée, on aura donc un tableau d'interpolation par id.
 si une interpolation s'ajoute aux précédentes,les données sont surchargées.
 
 */

/* 
 à un Perso peut etre associé un tableau de tweens ; si l'on souhaite agir sur le perso, il faut toucher l'ensemble des tweens. 
 anime serait un objet de clés id et pour valeur une Map de tweens.
 ou bien, un objet contenant les clés lié à un id d'une map générale.
 -> intéret : la plupart du temps, la fonction status est globale à toutes les animations.
 - Faut-il ici distinguer des anims qui ne seraient  pas pilotées par la telco ?
 - stopper les animations d'un Perso est nécessaire quand le Perso est supprimé.
 
 */

/* 
deplacer comme ressource 
*/
const defaultsTransition = {
	duration: DEFAULT_DURATION,
	easing: 'easeOutQuad',
};

function Anime(interpolation) {
	const animation = new Tweenable();

	const facade = {
		play() {
			animation.resume();
		},
		pause() {
			animation.pause();
		},
		seek(millisecond) {
			animation.seek(millisecond);
		},
		get() {
			return animation.get();
		},
		dispose() {
			animation.dispose();
		},
		cancel(gotoEnd = false) {
			animation.stop(gotoEnd);
			// animation.cancel(gotoEnd);
			animation.dispose();
		},
	};

	return {
		start(update, complete) {
			animation
				.tween({ ...defaultsTransition, ...interpolation, render: update })
				.then(() => {
					animation.dispose();
					complete();
				});
			return facade;
		},
	};
}

export class ControlAnimations {
	tweens = new Map(); // key:  tween-id, value: tween()
	tweenSet = new Map(); // key: actor-id , values: tween-id[]
	uuid(s = 8) {
		return nanoid(s);
	}

	status(status, id = null) {
		if (id) {
			this.tweenSet.has(id) &&
				this.tweenSet.get(id).forEach((key) => {
					this.tweens.get(key)[status]();
				});
		} else {
			this.tweens.forEach((anime) => anime[status]());
		}
	}
	pause() {
		this.status('pause');
	}
	play() {
		this.status('play');
	}
	stop(id) {
		this.status('stop', id);
		if (this.tweenSet.has(id)) {
			this.tweenSet.get(id).forEach((key) => this.tweens.delete(key));
			this.tweenSet.get(id).clear();
		}
	}

	reset() {
		this.tweenSet.clear();
		this.tweens.clear();
	}

	startAnimation(uuid, options) {
		const { id, interpolation, update } = options;
		const animation = new Anime(interpolation);
		const complete = this.completeTween(id, uuid, options);
		this.tweens.set(
			uuid,
			animation.start(this.process(id, uuid, update), complete)
		);
	}

	process(id, uuid, update) {
		return (state, _, timeElapsed) => {
			const tween = this.tweenSet.get(id);
			if (tween.has(uuid)) {
				const { interpolation } = tween.get(uuid);
				tween.set(uuid, { interpolation, state: { ...state, timeElapsed } });
			}
			update(state);
		};
	}

	/* 
	FIXME
dX et dY sont relatives au slot, en cas de changement de slot, une interpolation de relais peut prendre des valeurs erronées 
- soit ignorer ces valeurs,
- soit les recalculer dans le contexte de la vue
	*/

	tween(options) {
		const { id } = options;
		const from = {};

		if (this.tweenSet.has(id)) {
			Array.from(this.tweenSet.get(id)).forEach(([uuid, tween]) => {
				const { timeElapsed, ...state } = tween.state;

				const duration =
					(tween.interpolation.duration || defaultsTransition.duration) -
					(timeElapsed || 0);
				if (duration == 0) return;

				const interpolation = {
					...defaultsTransition,
					from: {},
					to: {},
					duration,
				};

				for (const prop in state) {
					if (['dX', 'dY'].includes(prop)) {
						from[prop] = (options.interpolation.from[prop] || 0) - state[prop];
						continue;
					}

					if (options.interpolation.from[prop] !== undefined) {
						from[prop] = state[prop];
					} else {
						interpolation.from[prop] = state[prop];
					}
				}

				for (const prop in interpolation.from) {
					interpolation.to[prop] = tween.interpolation.to[prop];
				}

				if (Object.keys(state).length) this.removeTween(id, uuid);
				if (Object.keys(interpolation.from).length) {
					this.setTween(id, interpolation, options);
				}
			});
		}

		const newInterpolation = {
			...options.interpolation,
			from: { ...options.interpolation.from, ...from },
		};
		console.log('newInterpolation', id, newInterpolation);
		this.setTween(id, newInterpolation, options);
	}

	setTween(id, interpolation, options) {
		const uuid = this.uuid();
		this.addTween(id, uuid, interpolation);
		this.startAnimation(uuid, { ...options, interpolation });
	}

	addTween(id, uuid, interpolation) {
		if (this.tweenSet.has(id)) {
			this.tweenSet.get(id).set(uuid, { interpolation, state: {} });
		} else {
			const map = new Map();
			map.set(uuid, { interpolation, state: {} });
			this.tweenSet.set(id, map);
		}
	}

	completeTween = (id, uuid, options) => () => {
		this.removeTween(id, uuid);
		typeof options.complete === 'function' && options.complete();
	};

	removeTween(id, uuid) {
		if (this.tweenSet.has(id)) {
			this.tweenSet.get(id).delete(uuid);
		}
		if (this.tweens.has(uuid)) {
			this.tweens.get(uuid).cancel();
			this.tweens.delete(uuid);
		}
	}
	info(i) {
		// console.log('this.tweens', this.tweens);
		// console.log('this.tweenSet', this.tweenSet);
		// console.log('this.uuid', this.uuid);
		const tSet = {};
		Array.from(this.tweenSet, (m) => {
			const tw = {};
			Array.from(m[1], (v) => {
				tw[v[0]] = v[1];
			});
			tSet[m[0]] = tw;
		});

		console.log('info : %s', i, tSet);
	}
}

export const controlAnimations = new ControlAnimations();
