import { o } from 'sinuous';

import { storeNodes } from './register/create-perso';

import { Img } from './composants/Img';
import { Toto, Bloc } from './composants/Bloc';
import { Perso } from './composants/Perso';

import { STRAP, TC, PAUSE } from './data/constantes';

export const emitter = { emit: (...args) => console.log('EMIT----->', args) };

function exe() {
  const counter = o(0);

  const Test = new Perso(
    {
      id: 'test',
      initial: { classes: 'perso', content: 'PPPERSOOO' },
      emit: {
        mousedown: {
          event: { ns: STRAP, name: 'move' },
          data: { id: 'text-sample', event: 'move' },
        },
        click: {
          event: { ns: TC, name: PAUSE },
        },
      },
    },
    emitter
  );

  const outer = {
    classes: 'outer',
    statStyle: {
      'background-color': 'royalblue',
      padding: '1rem',
      margin: 'auto',
    },
    dynStyle: {
      color: '#ff0000',
    },

    content: Test,
  };

  const inner = {
    classes: 'inner',
    content: counter,
    onclick: function (e) {
      console.log(this);
    },
  };

  const img = {
    classes: 'mysvg',
    dimensions: { width: 50, height: 100 },
    content: './img/Aesthedes.jpg',
  };

  const casting = {
    outer: new Toto({ id: 'outer', initial: outer }, emitter),
    inner: new Bloc({ id: 'inner', tag: 'button', initial: inner }, emitter),
    img: new Img({ id: 'picture', initial: img }, emitter),
  };

  console.log('casting', casting);

  // TODO comment retirer une prop de style ?
  const updatePerso = {
    toto: 'tsoin-tsoin',
    dynStyle: { color: '', 'font-weight': 'bold' },
    classes: 'tontonton',
    statStyle: { color: '#00ff00', 'font-size': 24 },
    'data-config': 'tintin',
    content: storeNodes.get(casting.inner.uuid),
    transition: {},
  };
  const updatePerso2 = {
    statStyle: {
      'font-weight': 'bold',
      'text-align': 'center',
    },
    transition: {
      from: { 'font-size': 24, color: '#e4349e' },
      to: { 'font-size': 48, color: '#5fe434' },
      duration: 5000,
    },
  };

  document.body.append(storeNodes.get(casting.outer.uuid));
  document.body.append(storeNodes.get(casting.img.uuid));

  const interval = setInterval(() => {
    counter(counter() + 1);
    if (counter() === 10) clearInterval(interval);
  }, 2000);

  setTimeout(() => {
    casting.outer.update(updatePerso);

    casting.img.update({
      dimensions: { width: 250, height: 500 },
      classes: 'tutu',
      content: './img/Aesthedes.jpg',
    });
  }, 2000);

  setTimeout(() => {
    // Test({ content: 'Lululululu', dynStyle: { color: 'white' } });
    casting.inner.update(updatePerso2);
  }, 3000);
}

setTimeout(exe, 1000);
