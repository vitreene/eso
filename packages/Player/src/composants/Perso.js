import { api } from 'sinuous';
import { Eso } from 'veso';

const { h } = api;
//entrée : props ->update
// sortie : node

export class Perso extends Eso {
  constructor(initial, emitter) {
    super(initial, emitter);
    return (props) => {
      this.update(props);
      return this.node;
    };
  }
  render(props) {
    const { tag = 'div', content = '', ...attrs } = props;
    return h(tag, attrs, content);
  }
}

/* 

const Toto = new Perso(initial)

*/
