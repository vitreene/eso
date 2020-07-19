import { o, api } from 'sinuous';
import { Eso } from './eso';
import { nanoid } from 'nanoid';
const h = api.h;

const storeNodes = new WeakMap();

const counter = o(0);

const fn = () => {};
class Perso extends Eso {
  constructor(story, emitter) {
    super(story, emitter);

    this.uuid = { uuid: nanoid(6), nature: 'bloc' };
    storeNodes.set(this.uuid, Bloc(this.attributes));

    this.node = storeNodes.get(this.uuid);
    return this;
  }
}
/* 
const attrs = {
  // class: o('toto'),
  style: o({ color: 'red' }),
  onclick(e) {
    console.log(this);
  },
};
 */

const initial = {
  classes: 'toto',
  dynStyle: { color: 'red' },
  onclick(e) {
    console.log(this);
  },
};
const Persos = {
  bloc: new Perso({ id: 'bloc', nature: 'bloc', initial }),
  /* 
  xbloc: {
    node: null,
    component: Bloc,
    attrs,
    update(props) {
      for (const prop in props) {
        if (!this.attrs[prop]) {
          this.attrs[prop] = o(props[prop]);
          api.property(this.node, this.attrs[prop](), prop);
        } else {
          this.attrs[prop](props[prop]);
        }
      }
    },
  },
   */
};

function Bloc(props) {
  console.log(props);
  return (
    <div {...props}>
      Compteur <b>{counter}</b>
    </div>
  );
}

document.body.append(Persos.bloc.node);
/* 
document.body.append(initPerso(Persos.bloc));

function initPerso(perso) {
  perso.node = perso.component(perso.attributes);
  return perso.node;
}
 */
const interval = setInterval(() => {
  counter(counter() + 1);
  if (counter() === 10) clearInterval(interval);
}, 1000);

const attr1 = {
  classes: 'tontonton',
  statStyle: { color: 'blue', 'font-size': '24px' },
  'data-config': 'tintin',
};

setTimeout(() => {
  Persos.bloc.update(attr1);
}, 2000);

// console.log(new Perso({ id: 'titi', initial: {}, fn }));
