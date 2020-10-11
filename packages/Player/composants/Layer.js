import { o, api } from 'sinuous';

import { Eso } from 'v-eso';
import { Slot } from './slot';
import { joinId } from '../Eso/lib/helpers';

const { h } = api;

export class Layer extends Eso {
  static nature = 'layer';
  render(props) {
    const layout = innerLayer(props.content(), this.id);
    return (
      <section id={this.id} style={props.style} class={props.class}>
        {layout}
      </section>
    );
  }
}

function innerLayer(content, layerId) {
  if (!content || Object.keys(content).length === 0) return null;
  const layer = [];
  for (const config of content) {
    const id = joinId(layerId, config.id);
    const item = new LayerItem({ style: config.statStyle, id });
    layer.push(item);
  }
  return layer;
}

function LayerItem(props) {
  const slot = new Slot({ uuid: props.id });
  return (
    <article id={props.id} style={props.style} class={props.class}>
      {slot}
    </article>
  );
}
