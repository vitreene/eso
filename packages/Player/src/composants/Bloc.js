import { api } from 'sinuous';
import { Eso } from 'veso';

const { h } = api;
// Composant minimal
export class Bloc extends Eso {
  static nature = 'bloc';
  render(props) {
    const { tag = 'div', content = '', ...attrs } = props;
    return h(tag, attrs, content);
  }
}
