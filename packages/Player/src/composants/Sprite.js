import { html } from 'sinuous';
import { Eso } from '../App/init';

export class Sprite extends Eso {
	static nature = 'sprite';
	constructor(story, imagesCollection) {
		super(story);
		this.sprite = imagesCollection.get(story?.initial?.content);

		/* 
		position devrait etre par défaut sur yml sprite
		ratio : il faut obtenir ces infos d'une autre facon pour que dimensions soit extrait de eso		
		
		*/

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
