import { fetchStories } from './fetch/fetching';
import './style.css';

import { initRuntime } from './runtime';
import { initStories } from './scene/init-stories';

//selectionner la scene à jouer
// ============================================================
import { stories, eventimes } from './stories/story01';
// import { stories, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================

console.log('stories', stories);
const Player = async () => {
	await initStories(stories, eventimes);
	initRuntime();
};

Player();

// ['/stories/file03.yaml'].forEach(fetchStories);

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);
