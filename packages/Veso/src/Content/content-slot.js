//FIX incomplet

export class SlotContent {
	static type = 'slot';
	content = null;
	collection = null;

	constructor(slots) {
		this.collection = slots;
		this.update = this.update.bind(this);
		// this.prerender = this.prerender.bind(this);
	}
	update(id) {
		return this.slots(id);
	}
}
