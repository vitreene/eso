// import "core-js/fn/array/flat-map";
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { fetchStories } from './fetch/fetching';
import './style.css';

import { initRuntime } from './runtime';
import { initStories } from './scene/init-stories';

//selectionner la scene à jouer
// ============================================================
// import { stories, eventimes } from './stories/story01';
// import { stories, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================

// console.log('stories', stories);

const Player = async () => {
	const story = await Promise.all(['/stories/file04.yaml'].map(fetchStories));
	console.log('STORY', story[0]);
	const { persos, eventimes } = story[0];

	await initStories(persos, eventimes);
	initRuntime();
};

Player();

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);
