import { o, api } from 'sinuous';
import { Eso } from './eso';

const h = api.h;

const counter = o(0);

const initial = {
  classes: 'toto',
  dynStyle: { color: 'red' },
  onclick(e) {
    console.log(this);
  },
  content: 'wat',
};

const updatePerso = {
  toto: 'tsoin-tsoin',
  dynStyle: { color: '' },
  classes: 'tontonton',
  statStyle: { color: 'blue', 'font-size': '24px' },
  'data-config': 'tintin',
  content: counter,
};

const interval = setInterval(() => {
  counter(counter() + 1);
  if (counter() === 10) clearInterval(interval);
}, 1000);

const Persos = {
  bloc: new Eso({ id: 'bloc', nature: 'bloc', initial }),
};

document.body.append(Persos.bloc.node);

setTimeout(() => {
  Persos.bloc.update(updatePerso);
  counter(counter() + 1);
  if (counter() === 10) clearInterval(interval);
}, 1000);
