import { EventEmitter2 } from 'eventemitter2';

import { fetchChapter } from '../fetch/fetch-chapter';
import { Scene } from '../Scene';
import { registerImages } from './register-images';

import { Scene as SceneProps, Story } from '../../../types/Entries-types';
import { Message } from '../../../types/message';
import { ImagesCollection } from '../../../types/initial';

interface Project {
	id?: string; // id du chapitre
	path?: string; // ou bien le path du chapitre
	scene?: string; // id de la scene, index 0 par défaut
}

const chapemitter = new EventEmitter2({ maxListeners: 0, delimiter: '.' });
const chapEvents = { 'main,start': 'start', 'story01,go': 'start' };

export class Chapter {
	scenes: SceneProps[];
	messages: Message;
	mediasCollection: Map<string, ImagesCollection> = new Map(); //

	constructor(props: Project) {
		this.init(props);
	}

	private async init({ path, scene }: Project) {
		const { scenes, messages } = await fetchChapter(path);
		console.log('PLAYER scenes', scenes);
		if (!scenes) return false;
		this.scenes = scenes;
		this.messages = messages;
		const index = scene ? scenes.findIndex((sc) => sc.id === scene) : 0;

		this.loadMedias(scenes[index]).then((response) => {
			console.log('RESPONSE', response.loaded);
			response.loaded && this.start(index);
		});
	}

	private async loadMedias(scene) {
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
		new Scene(scene, {
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
	}

	private test(evt) {
		console.log('XXXXXXXXXXXXX TEST CHAPTER ON', evt);
	}
}
