import { EventEmitter2 } from 'eventemitter2';

import { Scene } from '../Scene';
import { registerImages } from './register-images';
import { fetchChapter } from '../fetch/fetch-chapter';

import { END_SCENE } from '../data/constantes';
import { Message } from '../../../types/message';
import { ImagesCollection } from '../../../types/initial';
import { Scene as SceneProps, Story } from '../../../types/Entries-types';

interface Project {
	id?: string; // id du chapitre
	path?: string; // ou bien le path du chapitre
	scene?: string; // id de la scene, index 0 par défaut
}

const chapemitter = new EventEmitter2({ maxListeners: 0, delimiter: '.' });
const chapEvents = {
	[END_SCENE]: 'end',
	'main,start': 'start',
	'story01,go': 'start',
};

export class Chapter {
	scene: Scene;
	scenes: SceneProps[];
	messages: Message;
	mediasCollection: Map<string, ImagesCollection> = new Map(); //

	constructor(props: Project) {
		this.init(props);
	}

	private async init({ path, scene: sceneId }: Project) {
		const { scenes, messages } = await fetchChapter(path);
		console.log('PLAYER scenes', scenes);
		if (!scenes) return false;
		this.scenes = scenes;
		this.messages = messages;
		const index = sceneId
			? scenes.findIndex((scene) => scene.id === sceneId)
			: 0;

		this.loadMedias(scenes[index]).then((response) => {
			console.log('LA REPONSE', response.loaded);
			response.loaded && this.start(index);
		});
	}

	private async loadMedias(scene: SceneProps) {
		if (this.mediasCollection.has(scene.id)) return { loaded: true };
		const collection: ImagesCollection = new Map();
		return await Promise.all(
			scene.stories.map(async (story: Story) => {
				await registerImages(story.persos, collection);
			})
		).then(() => {
			this.mediasCollection.set(scene.id, collection);
			return { loaded: true };
		});
	}

	start(index: number) {
		const scene = this.scenes[index];
		this.initChapterEvents();
		this.scene = new Scene(scene, {
			messages: this.messages,
			mediasCollection: this.mediasCollection.get(scene.id),
			connectChapterEmitter: (emitter) => {
				console.log('connectChapterEmitter', emitter.eventNames());

				chapemitter.listenTo(emitter, chapEvents);
			},
		});
	}

	private initChapterEvents() {
		chapemitter.on('start', this.test);
		chapemitter.on('end', this.testEnd);
	}

	private test(evt) {
		console.log('••••••••••••• TEST CHAPTER ON', evt);
	}
	private testEnd(evt) {
		console.log('XXXXXXXXXXXXX TEST CHAPTER OFF', evt);
	}
}
