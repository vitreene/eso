export class StoreContentFactory {
	lib = new Map();
	content = new Map();
	constructor() {
		this.register = this.register.bind(this);
	}
	register(Content) {
		const type = Content.type;
		if (!type) console.error('Pas de type déclaré pour Content', Content);
		if (this.content.has(type))
			console.error('un Content de type %s a déjà été déclaré', type);
		this.content.set(type, Content);
	}

	create(type, collection) {
		if (!this.content.has(type))
			console.error('Le type %s ne correspond pas à un Content déclaré', type);

		const C = this.content.get(type);
		this.lib.set(type, new C(collection));
	}
}
