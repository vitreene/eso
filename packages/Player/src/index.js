import './style.css';
import { initRuntime } from './runtime';
import { TimeLiner } from './runtime/solver';
import { initStories } from './scene/init-stories';
import { initClock } from './scene/init-clock';

//selectionner la scene à jouer
// ============================================================
import { stories as objectStories, eventimes } from './stories/story01';
// import { stories as objectStories, eventimes } from './stories/story02';
const stories = Object.values(objectStories);
const timeLiner = new TimeLiner(eventimes);
// console.log("stories, eventimes", stories, eventimes);

// test import json
// ============================================================
fetch('stories/db.json')
  .then((response) => response.json())
  .then((data) => console.log('RESPONSE db', data));

// ============================================================

export const Player = () =>
  initStories(stories).then((casting) => {
    initRuntime(casting);
    initClock(timeLiner);
  });

Player();
