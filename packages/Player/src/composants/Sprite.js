import { api } from 'sinuous';
import { Eso } from 'veso';

const { h } = api;

export function createSpriteClass(imagesCollection) {
  return class Sprite extends Eso {
    static nature = 'sprite';
    constructor(story, emitter) {
      super(story, emitter);
      this.sprite = imagesCollection.get(story?.initial?.content);
      this.update({
        dimensions: {
          ...story.initial.dimensions,
          ratio: this.sprite.ratio,
        },
      });
    }

    render(props) {
      return (
        <img
          id={this.id}
          style={props.style}
          class={props.class}
          src={props.content}
          alt={props?.attr?.alt}
        />
      );
    }
  };
}
