// subscribe permet de synchoniser this_slots dans onScene

class Slots extends Map {
	signals = new Set();
	get(key) {
		return super.get(key);
	}
	set(key, value) {
		const exist = super.has(key);
		const res = super.set(key, value);
		if (!exist) this.signals.forEach((fn) => fn(key, value));
		return res;
	}
	subscribe(fn) {
		if (!this.signals.has(fn)) this.signals.add(fn);
		return () => this.unsubscribe(fn);
	}
	unsubscribe(fn) {
		if (!this.signals.has(fn)) this.signals.delete(fn);
	}
	toString() {
		return Array.from(this.signals);
	}
}

export const storeSlots = new Slots();
