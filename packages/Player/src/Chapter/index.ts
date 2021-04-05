import { EventEmitter2, GeneralEventEmitter } from 'eventemitter2';

import { Scene } from '../Scene/index';
import { registerImages } from './register-images';
import { fetchChapter } from '../fetch/fetch-chapter';

import { MAIN, END_SCENE } from '../data/constantes';
import { Message } from '../../../types/message';
import { ImagesCollection } from '../../../types/initial';
import { Scene as SceneProps, Story } from '../../../types/Entries-types';

interface Project {
	id?: string; // id du chapitre
	path?: string; // ou bien le path du chapitre
	scene?: string; // id de la scene, index 0 par défaut
}

const chapEmitter = new EventEmitter2({ maxListeners: 0, delimiter: '.' });
const chapEvents = {
	// [END_SCENE]: 'end',
	[MAIN + ',' + END_SCENE]: 'end',
	'main,start': 'start',
	'story01,go': 'start',
};

export class Chapter {
	times = 0;
	index: number;
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
		this.index = sceneId
			? scenes.findIndex((scene) => scene.id === sceneId)
			: 0;

		this.loadMedias(scenes[this.index]).then((response) => {
			console.log('OK - medias loaded', response.loaded);
			response.loaded && this.start(this.index);
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
		console.log(index, scene);

		if (!scene) {
			this.endChapter();
			return;
		}
		this.initChapterEvents();
		this.scene = new Scene(scene, {
			messages: this.messages,
			mediasCollection: this.mediasCollection.get(scene.id),
			connectChapterEmitter: (emitter: EventEmitter2) => {
				// console.log('connectChapterEmitter', emitter.eventNames());
				chapEmitter.listenTo(
					(emitter as unknown) as GeneralEventEmitter,
					chapEvents
				);
			},
		});
	}

	private initChapterEvents() {
		chapEmitter.once('start', this.onSceneStart);
		chapEmitter.once('end', this.onSceneEnd.bind(this));
	}

	private onSceneStart(e) {
		console.log('••••••••••••• TEST CHAPTER ON', e);
	}
	private onSceneEnd(e) {
		console.log('XXXXXXXXXXXXX TEST CHAPTER OFF', e);
		this.start(++this.index);
	}

	private endChapter() {
		console.log('%c+++ IT IS THE END MY FRIENDS +++', {
			color: 'blue',
			'font-weight': 'bold',
		});
		this.times++;

		this.index = 0;
		this.times < 1 && this.start(this.index);
	}
}
