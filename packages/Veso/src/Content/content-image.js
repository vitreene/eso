export class ImageContent {
	static type = 'image';
	content = null;
	collection = null;

	constructor(collection) {
		this.collection = collection;
		this.update = this.update.bind(this);
	}
	update(content, current) {
		const { src, fit } =
			typeof content === 'string'
				? { src: content, fit: content.fit || current?.fit || DEFAULT_FIT }
				: content;
		const img = this.collection.has(src) && this.collection.get(src);
		return { img, fit };
	}
}
