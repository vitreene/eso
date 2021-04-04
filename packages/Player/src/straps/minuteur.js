// import { emitter } from '../App/init';
import { DEFAULT_NS, STRAP } from '../data/constantes';

export default class Minuteur {
	constructor(data, emitter) {
		this.emitter = emitter;
		this.count = this.count.bind(this);
		this.stop = this.stop.bind(this);
		this.duration = data.duration || 10e3;
		this.reactions = data.reactions;
		// console.log('Minuteur', this.start, this.duration);
		this.emitter.on('secondes', this.count);
		this.emitter.on([STRAP, 'minuteur-stop'], this.stop);
	}

	count(secondes) {
		if (!this.start) this.start = secondes * 1000;
		const elapsed = this.duration + (this.start - secondes * 1000);
		// console.log('Minuteur count', elapsed / 1000);
		// FIXME valeur 0 pour content doit s'afficher
		this.emitter.emit([DEFAULT_NS, 'update-counter'], {
			content: Math.round(elapsed / 1000),
		});

		if (elapsed <= 0) {
			this.emitter.off('secondes', this.count);
			this.emitter.emit([STRAP, this.reactions.lost]);
		}
	}

	stop() {
		this.emitter.off('secondes', this.count);
	}
}
