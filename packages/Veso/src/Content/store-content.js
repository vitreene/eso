export class Content {
	constructor(collection) {
		this.collection = collection;
	}
	update() {}
	prerender() {}
}

export class StoreContentFactory {
	lib = new Map();

	constructor() {
		this.register = this.register.bind(this);
	}
	register(Content) {
		const type = Content.type;

		console.log('type, this', type, this);

		if (!type) console.error('Pas de type déclaré pour Content', Content);
		if (this.lib.has(type))
			console.error('un Content de type %s a déjà été déclaré', type);
		this.lib.set(type, Content);
	}

	create(type, collection) {
		if (!this.lib.has(type))
			console.error('Le type %s ne correspond pas à un Content déclaré', type);

		const C = this.lib.get(type);
		return new C(collection);
		// const Cl = this.lib.get(type);
		// let C = new Cl(collection);
		// return Object.assign(C, content[type]);
	}
}
