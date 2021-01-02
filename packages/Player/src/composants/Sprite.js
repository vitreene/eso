import { html } from 'sinuous';
import { Eso } from 'veso';

// import { imagesCollection } from '../Scene/images-collection';

import { scene } from '../Scene';
const imagesCollection = scene.imagesCollection;

export class Sprite extends Eso {
	static nature = 'sprite';
	constructor(story, emitter) {
		super(story, emitter);
		this.sprite = imagesCollection.get(story?.initial?.content);
		this.update({
			classStyle: { position: 'absolute' },
			dimensions: {
				...story.initial.dimensions,
				ratio: this.sprite.ratio,
			},
		});
	}

	render(props) {
		const { id, content, attr, ...others } = props;
		return html`<img id=${id} src=${content} ...${others} ...${attr} />`;
	}
}
