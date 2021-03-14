// import "core-js/fn/array/flat-map";
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// import { fetchStories } from './fetch/fetching';
import { fetchChapter } from './fetch/fetch-chapter';

import './style.css';

import { Scene } from './Scene';

const Player = async (path) => {
	// const scenes = await Promise.all(path.map(fetchStories));
	// const scenes = await fetchStories(path);
	const { scenes, messages } = await fetchChapter(path);
	console.log('PLAYER scenes', scenes);
	new Scene(scenes[0], messages);
};
const path = '/stories/App21.yml';

// const path = ['/stories/story10.yml'];

Player(path);

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);

//selectionner la scene à jouer
// ============================================================
// import { stories as persos, eventimes } from './stories/story01';
// import { stories as persos, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================
