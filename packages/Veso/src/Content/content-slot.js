export class SlotContent {
	static type = 'slot';
	slot = null;
	constructor(slotFn) {
		this.slot = slotFn;
	}

	content = {
		update(el) {
			console.log('update slot');
			return el;
		},
		prerender(el) {
			console.log('prerender slot');
			return el;
		},
	};
}
