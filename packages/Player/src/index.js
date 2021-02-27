// import "core-js/fn/array/flat-map";
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// import { fetchStories } from './fetch/fetching';
import { fetchChapter } from './fetch/fetch-chapter';

import './style.css';

import { Scene } from './Scene';

const Player = async (path) => {
	// const casting = await Promise.all(path.map(fetchStories));
	// const casting = await fetchStories(path);
	const casting = await fetchChapter(path);
	console.log('PLAYER casting', casting);
	new Scene(casting[0]);
};
const path = '/stories/App20.yml';

// const path = ['/stories/story10.yml'];

Player(path);

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);

//selectionner la scene à jouer
// ============================================================
// import { stories as persos, eventimes } from './stories/story01';
// import { stories as persos, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================
