import { emitter } from '../data/emitter';
import { DEFAULT_NS, STRAP } from '../data/constantes';

export default class Minuteur {
	constructor(data) {
		this.count = this.count.bind(this);
		this.stop = this.stop.bind(this);
		this.duration = data.duration || 10e3;
		this.reactions = data.reactions;
		// console.log('Minuteur', this.start, this.duration);
		emitter.on('secondes', this.count);
		emitter.on([STRAP, 'minuteur-stop'], this.stop);
	}

	count(secondes) {
		if (!this.start) this.start = secondes * 1000;
		const elapsed = this.duration + (this.start - secondes * 1000);
		// console.log('Minuteur count', elapsed / 1000);
		// FIXME valeur 0 pour content doit s'afficher
		emitter.emit([DEFAULT_NS, 'update-counter'], {
			content: Math.round(elapsed / 1000),
		});

		if (elapsed <= 0) {
			emitter.off('secondes', this.count);
			emitter.emit([STRAP, this.reactions.lost]);
		}
	}

	stop() {
		emitter.off('secondes', this.count);
	}
}
