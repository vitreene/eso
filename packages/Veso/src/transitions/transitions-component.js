import { controlAnimations } from '../shared/control-animation';
import {
	selectTransition,
	directTransition,
} from '../shared/select-transition';
import { fromTo } from '../shared/from-to';

export function doTransition(perso, update, emitter) {
	if (!update) return null;
	const callback = (between) => perso.update({ between });
	const accumulate = syncRafUpdate(callback);
	(Array.isArray(update) ? update : [update]).forEach(exeTransition);
	return update;

	// FIXME from et to peuvent etre nuls ?
	function exeTransition(props) {
		const options = props.direct
			? directTransition(props)
			: selectTransition(props);

		// from-to
		const interpolation = fromTo(options, perso.history, perso.uuid);
		if (!interpolation) return;

		// mettre à jour la position avant le rafraichissement
		perso.update({ between: interpolation.from });

		//lancer la ou les transitions
		controlAnimations.tween({
			id: perso.id,
			interpolation,
			update: interpolate,
			complete() {
				[perso?.oncomplete, props?.oncomplete]
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

	function interpolate(between) {
		accumulate.add(between);
	}
}
/**
 *
 * @param {*} callback // lance l'update du perso
 * si plusieurs transitions en cours,
 * il faut reduire les valeurs sorties par chacune.
 * il arrive que deux transitions se suivant, la première l'emporte en priorité sur la suivant.
 */

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

			callback(between);
			fn.forEach((f) => f());
		},
		flush() {
			this.update();
			this.cumul = [];
		},
	};
}
