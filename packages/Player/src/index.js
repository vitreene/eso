// import { api } from 'sinuous';
// import { trace } from 'sinuous-trace';
// import { logTrace } from 'sinuous-trace/log';

import './style.css';

import { initRuntime } from './runtime';
import { initStories } from './scene/init-stories';

//selectionner la scene à jouer
// ============================================================
// import { stories, eventimes } from './stories/story01';
// import { stories, eventimes } from './stories/story02';
import { stories, eventimes } from './stories/story03';
// ============================================================

// trace(api);
// logTrace(api, trace );

const Player = async () => {
	await initStories(stories, eventimes);
	initRuntime();
};

Player();

// test import json
// ============================================================
// fetch('stories/db.json')
// 	.then((response) => response.json())
// 	.then((data) => console.log('RESPONSE db', data));

// ============================================================
