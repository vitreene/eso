// import "core-js/fn/array/flat-map";
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { fetchStories } from './fetch/fetching';
import './style.css';

import { Scene } from './Scene';

const Player = async (path) => {
	// const casting = await Promise.all(path.map(fetchStories));
	const casting = await fetchStories(path);
	console.log('PLAYER casting', casting);
	new Scene(casting);
};

const path = ['/stories/story10.yml'];
// const path = ['/stories/story11.yml'];
// const path = ['/stories/persos01.yml'];
// const path = ['/stories/file04.yml'];

Player(path);

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);

//selectionner la scene à jouer
// ============================================================
// import { stories as persos, eventimes } from './stories/story01';
// import { stories as persos, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================
