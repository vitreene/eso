import { o, api } from 'sinuous';

export function render(props) {
  for (const p in props) {
    if (!this.attributes[p]) {
      this.attributes[p] = o(props[p]);
      this.node && api.property(this.node, this.attributes[p], p);
    } else {
      console.log('this.attributes[p]', this.attributes, p);
      this.attributes[p](props[p]);
    }
  }

  console.log('attributes', this.attributes);
  console.log('this.current', this.current);
}
