import { o, /* api, */ svg } from 'sinuous';
import { computed } from 'sinuous/observable';
// const { hs: h } = api;

import { Eso } from 'veso';

const src = './ikono/Aesthedes.jpg';

const imageCollection = new Map();
loadImages([src]);

async function loadImages(srcs) {
  return await Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve, reject) => {
          const ikono = new Image();
          ikono.onload = () => {
            imageCollection.set(src, {
              width: ikono.width,
              height: ikono.height,
              ratio: ikono.width / ikono.height,
              src,
            });
            console.log('loadImages', imageCollection);
            resolve(true);
          };
          ikono.onerror = reject;
          ikono.src = src;
        })
    )
  )
    .then(() => imageCollection)
    .catch((err) => console.log('erreur image :', src, err));
}

// cache l'implémentation
const constrainImage = {
  contain: 'meet',
  cover: 'slice',
  meet: 'contain',
  slice: 'cover',
  undefined: 'slice',
};

export class Img extends Eso {
  static nature = 'img';

  // static imageCollection = imageCollection;

  constructor(story, emitter) {
    super(story, emitter);
    imageCollection.has(story.initial.content) &&
      this.img(imageCollection.get(story.initial.content));
    this.meetOrSlice = constrainImage[story.initial.fit];
  }

  // TODO ajouter img à this.content
  update(props) {
    super.update(props);
    props.content &&
      imageCollection.has(props.content) &&
      this.img(imageCollection.get(props.content));
    props.fit && (this.meetOrSlice = constrainImage[props.fit]);
  }

  render(props) {
    this.img = o({});
    const { id, content, ...attrs } = props;
    const viewBox = computed(
      () => `0 0 ${this.img()?.width || 0} ${this.img()?.height || 0}`
    );
    const src = computed(() => this.img()?.src);

    return svg`<svg
        id=${props.id}
        viewBox=${viewBox}
        ...${attrs}
        preserveAspectRatio=${'xMidYMid ' + (this.meetOrSlice || 'slice')}
      >
        <image href=${src} width="100%" height="100%" />
      </svg>`;
  }
}
