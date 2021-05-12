import { EventEmitter2, GeneralEventEmitter } from 'eventemitter2';

import { Scene } from '../Scene/index';
import { registerImages } from './register-images';
import { fetchChapter } from '../fetch/fetch-chapter';

import { MAIN, END_SCENE } from '../data/constantes';
import { Message } from '../../../types/message';
import { ImagesCollection } from '../../../types/initial';
import { Scene as SceneProps, Story } from '../../../types/Entries-types';
import { Audio2D } from 'audio2d';
import { registerAudio, AudioClips } from './register-audios';

interface Project {
	id?: string; // id du chapitre
	path?: string; // ou bien le path du chapitre
	scene?: string; // id de la scene, index 0 par défaut
	audio?: AudioContext; // id de la scene, index 0 par défaut
}

const chapEmitter = new EventEmitter2({ maxListeners: 0, delimiter: '.' });
const chapEvents = {
	// [END_SCENE]: 'end',
	[MAIN + ',' + END_SCENE]: 'end',
	'main,start': 'start',
	'story01,go': 'start',
};
const connectChapterEmitter = (emitter: EventEmitter2) => {
	// console.log('connectChapterEmitter', emitter.eventNames());
	chapEmitter.listenTo(emitter as unknown as GeneralEventEmitter, chapEvents);
};

export class Chapter {
	times = 0;
	index: number;
	scene: Scene;
	audio: AudioContext;
	scenes: SceneProps[];
	messages: Message;
	audioCollection: Map<string, AudioClips> = new Map(); //
	mediasCollection: Map<string, ImagesCollection> = new Map(); //
	registerAudio: (
		scene: SceneProps
	) => Promise<{ id: string; audioClips: AudioClips }>;

	constructor(props: Project) {
		this.loadMedias = this.loadMedias.bind(this);
		this.audio = props.audio;
		this.registerAudio = registerAudio(props.audio);
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

		await this.loadAudio(scenes);
		// chager les medias de la scene courante, puis ensuite les autres
		this.loadMedias(scenes[this.index]).then((response) => {
			console.log('OK - medias loaded', response.loaded);

			Promise.all(
				scenes.filter((_, i) => i !== this.index).map(this.loadMedias)
			).then((responses) => {
				responses.forEach((r, i) =>
					console.log('OK - other medias loaded', i, r.loaded)
				);
			});

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

	private async loadAudio(scenes: SceneProps[]) {
		const { id, audioClips } = await this.registerAudio(scenes[this.index]);
		this.audioCollection.set(id, audioClips);
		Promise.all(
			scenes.filter((_, i) => i !== this.index).map(this.registerAudio)
		).then((collection) => {
			collection.forEach(({ id, audioClips }) =>
				this.audioCollection.set(id, audioClips)
			);
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
			audioCollection: this.audioCollection.get(scene.id),
			connectChapterEmitter,
			audio: this.audio,
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
