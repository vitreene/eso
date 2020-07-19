<<<<<<< HEAD
// https: stackoverflow.com/questions/46165545/access-dom-when-using-hyper-component

import { Eso } from 'Eso';

export class Perso extends Eso {
  constructor(story, emitter) {
    super(story, emitter);
    const { id, emit } = story;
    this.id = id;
    this.registerEmits(emit, emitter);
    this.registerAttributes(story);
  }

  handleEvent(e) {
    console.log('handleEvent', e.type, this.state);
    this.emit[e.type] && this.emit[e.type]({ e, store: () => this.store() });
  }

  registerEmits(emit, emitter) {
    const keyEvents = Eso.registerKeyEvents(emit, emitter);
    this.emit = keyEvents || {};

    if (!keyEvents) return;
    for (const event in keyEvents) {
      this.node.addEventListener(event, this);
    }
    this.update({ statStyle: { pointerEvents: 'all' } });
  }

  registerAttributes(story) {
    if (!story || !story.initial) return;
    const { attr } = story.initial;
    if (!attr) return;

    for (const [key, val] of Object.entries(attr))
      this.node.setAttribute(key, val);
  }
}
=======
// https: stackoverflow.com/questions/46165545/access-dom-when-using-hyper-component

import { Eso } from 'Eso';

export class Perso extends Eso {
  constructor(story, emitter) {
    super(story, emitter);
    const { id, emit } = story;
    this.id = id;
    this.registerEmits(emit, emitter);
    this.registerAttributes(story);
  }

  handleEvent(e) {
    console.log('handleEvent', e.type, this.state);
    this.emit[e.type] && this.emit[e.type]({ e, store: () => this.store() });
  }

  registerEmits(emit, emitter) {
    const keyEvents = Eso.registerKeyEvents(emit, emitter);
    this.emit = keyEvents || {};

    if (!keyEvents) return;
    for (const event in keyEvents) {
      this.node.addEventListener(event, this);
    }
    this.update({ statStyle: { pointerEvents: 'all' } });
  }

  registerAttributes(story) {
    if (!story || !story.initial) return;
    const { attr } = story.initial;
    if (!attr) return;

    for (const [key, val] of Object.entries(attr))
      this.node.setAttribute(key, val);
  }
}
>>>>>>> origin/master
