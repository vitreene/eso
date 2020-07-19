import { o, api } from 'sinuous';
export function render(props) {
  for (const prop in props) {
    if (!this.attributes[prop]) {
      this.attributes[prop] = o(props[prop]);
      this.node && api.property(this.node, this.attributes[prop](), prop);
    } else {
      this.attributes[prop](props[prop]);
    }
  }
  console.log('attributes', this.attributes);
  console.log('this.current', this.current);
}
