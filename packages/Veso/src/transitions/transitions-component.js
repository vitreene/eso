import { fromTo } from './from-to';
import { controlAnimations } from '../shared/control-animation';
import { selectTransition, directTransition } from './select-transition';
// import { DEFAULT_DURATION } from '../shared/constantes';

export function doTransition(seek, perso, transition, emitter) {
	if (!transition || !transition.length) return null;

	// transitionToDefault(transition, perso.to);
	const accumulate = setCumulateCallback(perso);
	const interpolate = (between) => accumulate.add(between);

	transition.forEach(exeTransition);
	return transition;

	function exeTransition(transition) {
		const options = transition.direct
			? directTransition(transition)
			: selectTransition(transition);

		// from-to
		const interpolation = fromTo(options, perso);
		if (!interpolation) return;

		// mettre à jour la position avant le rafraichissement
		accumulate.add(interpolation.from);

		//lancer la ou les transitions
		seek
			? controlAnimations.interpolate(interpolation, interpolate)
			: controlAnimations.tween({
					id: perso.id,
					interpolation,
					update: interpolate,
					complete() {
						[perso?.oncomplete, transition?.oncomplete]
							.flat()
							.forEach(function (action) {
								if (!action) return;
								const { event, data } = action;
								// console.log('action oncomplete', action);
								accumulate.add(function emit() {
									emitter.emit([event.channel, event.name], data);
								});
							});
					},
			  });
	}
}
/**
 *
 * @param {*} callback // lance l'update du perso
 * si plusieurs transitions en cours,
 * il faut reduire les valeurs sorties par chacune.
 * il arrive que deux transitions se suivant, la première l'emporte en priorité sur la suivant.
 */

export function setCumulateCallback(perso) {
	const callback = (between) => perso.update({ between });
	return syncRafUpdate(callback);
}
// TODO déplacer la fonction pour centraliser les appels à raf
function syncRafUpdate(callback) {
	return {
		cumul: [],
		add(value) {
			if (!this.cumul.length) requestAnimationFrame(() => this.flush());
			this.cumul.push(value);
		},

		update() {
			// executer les fonctions après les updates
			let between = {};
			let fn = [];

			for (const acc of this.cumul) {
				typeof acc === 'function' ? fn.push(acc) : Object.assign(between, acc);
			}
			// console.log('between', between);
			callback(between);
			fn.forEach((f) => f());
		},
		flush() {
			this.update();
			this.cumul = [];
		},
	};
}

// function transitionToDefault(transition, to) {
// 	if (Object.keys(to).length) {
// 		let d = transition.map((t) => t.duration).filter(Boolean);
// 		const duration = d.length ? Math.min(...d) : DEFAULT_DURATION;
// 		transition.unshift({ from: {}, to, duration });
// 	}
// 	return transition;
// }
