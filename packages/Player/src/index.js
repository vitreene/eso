// import "core-js/fn/array/flat-map";
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { fetchStories } from './fetch/fetching';
import './style.css';

import { initStory, start } from './scene/init-story';

//selectionner la scene à jouer
// ============================================================
// import { stories as persos, eventimes } from './stories/story01';
// import { stories as persos, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================

// console.log('stories', stories);

const Player = async (path) => {
	const stories = await Promise.all(path.map(fetchStories));
	await Promise.all(stories[0].map(initStory));
};

const path = ['/stories/story11.yml'];
// const path = ['/stories/persos01.yml'];
// const path = ['/stories/file04.yml'];

Player(path).then(start);

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);
