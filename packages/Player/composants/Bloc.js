import { o, api, html } from 'sinuous';

import { Eso } from 'v-eso';
import { storeNodes } from 'v-eso/create-perso';
import { emitter } from '../index';

const { h } = api;
// Composant minimal
export class Bloc extends Eso {
  static nature = 'bloc';
  render(props) {
    const { tag = 'div', content = '', ...attrs } = props;
    return h(tag, attrs, content);
  }
}

// Ajouter des propriétés spécifiques au prerender
export class Toto extends Bloc {
  constructor(initial, emitter) {
    super(initial, emitter);
    this.revision.toto = {
      update(props, state) {
        console.log('(TOTO)', props, state);
        return props;
      },
    };
  }
}

const initial = {
  classes: 'initial',
  statStyle: {
    'background-color': 'royalblue',
    padding: '1rem',
    margin: 'auto',
  },
  dynStyle: {
    color: '#ff0000',
  },

  content: 'BLEK OUTER',
};

const innner = new Toto({ id: 'initial', initial }, emitter);

// rendre un composant à l'intérieur d'un autre
export class Blek extends Eso {
  render(props) {
    const { tag = 'div', content = 'TITIUT', ...attrs } = props;
    // return html`<div ${ attrs}>${() => innner}</div>`;
    return h(tag, attrs, storeNodes.get(innner.uuid));
  }
}
