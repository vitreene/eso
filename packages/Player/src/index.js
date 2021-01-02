// import "core-js/fn/array/flat-map";
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { fetchStories } from './fetch/fetching';
import './style.css';

// import { initStory, start } from './init/init-story';
import { scene } from './Scene';

const Player = async (path) => {
	const casting = await Promise.all(path.map(fetchStories));
	console.log('PLAYER casting', casting[0]);

	const { stories } = casting[0];
	console.log('PLAYER stories', stories);
	// await Promise.all(stories.map(initStory));
	await Promise.all(stories.map(scene.addStory));
};

const path = ['/stories/story10.yml'];
// const path = ['/stories/story11.yml'];
// const path = ['/stories/persos01.yml'];
// const path = ['/stories/file04.yml'];

Player(path).then(scene.start);

// ['/stories/file01.yaml', '/stories/file02.yaml'].forEach(fetchStories);

//selectionner la scene à jouer
// ============================================================
// import { stories as persos, eventimes } from './stories/story01';
// import { stories as persos, eventimes } from './stories/story02';
// import { stories, eventimes } from './stories/story03';
// ============================================================
