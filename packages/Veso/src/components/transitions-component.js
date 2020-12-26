/**
 * transition a un profil différent, c'est un emitter
 * params transition { {from, to, duration, ease, progress, onstart, onpdate, oncomplete}}
 * params node
 * params this.update();
 * returns diff
 */

/* 
 quelle structure pour les données en entrée :
 - from et to peuvent contenir un objet, une string ou null. 
 - si  props est un tableau d'objets, chaque objet a une durée différente qui sont envoyés en meme temps.
 - from et to sont conformés. les props manquantes sont lus directement dans les computedstyles du node
 - en sortie, un emetteur envoie  un objet 
 between {style, progression, transition }
 dans addToStore, progression et transition seront utilisés pour la timeline, style est destiné à prerender
 */

import { controlAnimations } from '../shared/control-animation';
import {
	selectTransition,
	directTransition,
} from '../shared/select-transition';
import { fromTo } from '../shared/from-to';

export function transition(emitter) {
	const self = this;
	const callback = (between) => self.update({ between });
	const accumulate = syncRafUpdate(callback);

	function update(props) {
		if (!props) return null;
		(Array.isArray(props) ? props : [props]).forEach(doTransition);
		return props;
	}

	// FIXME from et to peuvent etre nuls ?
	function doTransition(props) {
		const options = props.direct
			? directTransition(props)
			: selectTransition(props);

		// from-to
		const interpolation = fromTo(options, self.history, self.uuid);
		if (!interpolation) return;

		// mettre à jour la position avant le rafraichissement
		self.update({ between: interpolation.from });

		//lancer la ou les transitions
		controlAnimations.tween({
			id: self.id,
			interpolation,
			update: interpolate,
			complete() {
				[self?.oncomplete, props?.oncomplete].flat().forEach(function (action) {
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

	return { update };
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
