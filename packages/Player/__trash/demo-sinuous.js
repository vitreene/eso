// https://codesandbox.io/s/sinuous-jsx-context-8itgu?file=/src/index.js:488-510
/** @jsx */
import { o, html, api } from 'sinuous';
let h = api.h;
/* 
let counter = o(0);
let HelloMessage = ({ name }) => (
  <>
    <div>Hello {name}</div>
    <div>How are you? {counter}</div>
    <div>
      Counter <b>{counter}</b>
    </div>
  </>
);

document.getElementById('app').append(<HelloMessage name="World" />);

setInterval(() => {
  counter(counter() + 1);
}, 1000); */

// /** @jsx h */
// import { o, html, h } from 'sinuous';

const counter = o(0);

/**
 * Write a view with the html`` tagged template.
 */
const taggedTemplateView = () => {
  return html` <div>Counter ${counter}</div> `;
};
document.body.append(taggedTemplateView());

/**
 * Write a view with hyperscript function calls.
 */
const hyperscriptView = () => {
  return h('div', 'Counter ', counter);
};
document.body.append(hyperscriptView());

/**
 * Write a view with JSX.
 */

const attrs = {
  class: o('toto'),
  style: o({ color: 'red' }),
  onclick(e) {
    console.log(this);
  },
};
const Bloc = (props) => {
  return (
    <div {...props}>
      Counter <b>{counter}</b>
    </div>
  );
};
document.body.append(Bloc(attrs));

setInterval(() => counter(counter() + 1), 1000);
