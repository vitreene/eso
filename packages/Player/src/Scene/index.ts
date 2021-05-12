import { o } from 'sinuous';
import { EventEmitter2 } from 'eventemitter2';
import { initVeso } from 'veso';

import { Stage } from '../zoom';
import { Slots } from './store-slots';
import { OnScene } from './on-scene.js';

import { registerStraps } from './register/register-straps';
import { registerActions } from './register/register-actions';

import { TimeLiner } from './runtime/timeline';
import { clock, Clock } from './runtime/clock';
import { addEventList } from './runtime/add-event-list';

import { TC, MAIN, PAUSE, APP_ID, DEFAULT_NS } from '../data/constantes';

import {
	Cast,
	Story,
	SceneCast,
	ScenePersos,
	StoryWoEventimes,
	Scene as SceneType,
} from '../../../types/Entries-types';
import { Message } from '../../../types/message';
import { Eventime } from '../../../types/eventime';
import { ImagesCollection } from '../../../types/initial';
import { AudioClips } from '../Chapter/register-audios';

// export interface MediasProps {
// 	slots?: Slots;
// 	messages: Message;
// 	audioCollection?:SceneSounds['soundIds'];
// 	mediasCollection: ImagesCollection;
// }

export interface SceneOptions {
	messages: Message;
	audioCollection?: AudioClips;
	mediasCollection: ImagesCollection;
	connectChapterEmitter: (emitter: EventEmitter2) => void;
	audio: AudioContext;
}

export type MediasProps = Omit<
	SceneOptions,
	'connectChapterEmitter' | 'audio'
> & {
	slots?: Slots;
};

const onAny = (emitter) =>
	emitter.onAny(function (event, value) {
		if (event !== 'elapsed') {
			console.log('EVENT->', event, value);
			// console.log(emitter.listeners(event));
			value === 0 && console.log(emitter.eventNames(event));
		}
	});
const timer = (emitter, duree = 1000) =>
	setTimeout(() => {
		emitter.emit([TC, PAUSE]);
	}, duree);

export const appContainer = document.getElementById(APP_ID);

export class Scene {
	id: string;
	channel: string;
	name?: string;
	description?: string;

	emitter = new EventEmitter2({
		maxListeners: 0,
		delimiter: '.',
	});

	cast: SceneCast = {};
	slots: Slots = new Slots(); //
	audio: AudioContext;
	audioCollection: AudioClips;
	persos: ScenePersos = new Map(); //
	straps: any;
	clock: Clock;
	onScene: OnScene = new OnScene();
	timeLine: TimeLiner = new TimeLiner();
	// telco: () => {};
	// onEnd: () => {};
	// onStart: () => {};
	onEndQueue = [];

	constructor(
		{ stories, ...scene }: SceneType,
		{
			messages,
			mediasCollection,
			audioCollection,
			connectChapterEmitter,
			audio,
		}: SceneOptions
	) {
		this.id = scene.id;
		this.audio = audio;
		this.name = scene.name;
		this.description = scene.description;
		this.audioCollection = audioCollection;

		this.start = this.start.bind(this);
		this.slot = this.slot.bind(this);
		this.addStory = this.addStory.bind(this);
		this._publish = this._publish.bind(this);
		this.updateSlot = this.updateSlot.bind(this);
		this.renderOnResize = this.renderOnResize.bind(this);

		connectChapterEmitter(this.emitter);
		registerStraps(this.cast, this.emitter);

		const medias: MediasProps = {
			messages,
			mediasCollection,
		};

		this.slots.subscribe(this.onScene.addSlots);
		this.initStories(stories, scene.entry, medias);

		const entry = this.initOnMount(stories, scene.cast);
		this.entryInDom(entry).then(this.start);

		// timer(this.emitter, 1200);
		// console.log(this.persos);
		// onAny(this.emitter);
	}

	initStories(stories: Story[], entry: string, medias: MediasProps) {
		this.timeLine.addStartEvent();
		const registerPersos = this._registerComponents(medias);
		stories
			.sort((s) => (s.id === entry ? -1 : 0))
			.forEach(this.addStory(registerPersos));
		this.timeLine.addEndEvent();
	}

	initOnMount(stories: Story[], casting: Cast[]) {
		let entry: Story;
		for (const cast of casting) {
			const story = stories.find((s) => s.id === cast.id);
			if (cast.isEntry) entry = story;
			else {
				this.emitter.prependListener(
					[MAIN, cast.startAt.toString()],
					this.onMount(story, cast)
				);
			}
		}
		return entry;
	}

	async entryInDom(entry: Story) {
		await new Promise(requestAnimationFrame);
		if (!entry) return;
		const { root } = entry;
		this.onMount(entry, { root })();
		// NOTE
		this.slot(root);

		console.log('DOM', this.persos.get(root));

		this.onScene.areOnScene.set(root, root);
		appContainer.innerHTML = '';
		appContainer.appendChild(this.persos.get(root).node);
	}

	onMount(story: Story, cast) {
		return () => {
			console.log('onMount-->', story.id);
			this._setStoryCast(story, cast);
			this.activateZoom(story.id);
		};
	}

	start() {
		const _clock = clock(this.timeLine, this.emitter);
		addEventList(_clock.chrono, this.timeLine, this.emitter);
		// console.log('START', emitter.eventNames());
		return _clock.start();
	}

	private _registerComponents({ messages, mediasCollection }: MediasProps) {
		const contentTypes = {
			slot: this.slot,
			layer: this.slot,
			text: messages,
			image: mediasCollection,
		};
		return initVeso(this.emitter, contentTypes);
	}

	addStory(registerPersos) {
		return (story: Story) => {
			const { eventimes, ...others } = story;
			this._addEventsToTimeLine(eventimes);
			this._register(others, registerPersos);
		};
	}

	private _addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	private _register(story: StoryWoEventimes, registerPersos) {
		const { channel, persos } = story;
		const { register, update } = registerPersos;
		const publish = this._publish(story.id, update);
		registerActions(channel, persos, publish, this.emitter);

		const addedPersos = register(persos);
		this.persos = concatMaps(this.persos, addedPersos);
	}

	private _setStoryCast({ id, stage, persos }: Story, { root }) {
		const node = this.persos.has(root)
			? this.persos.get(root).node
			: document.getElementById(root);
		if (!node) return;
		this.cast[id] = {
			zoom: new Stage(node, stage, this.renderOnResize(id)),
			persos: new Set(persos.map((p) => p.id)),
		};
	}

	renderOnResize(storyId: string) {
		return () => {
			for (const id of this.onScene.areOnScene.keys()) {
				this.cast[storyId].persos.has(id) &&
					this.persos.get(id).prerender(this.cast[storyId].zoom.box);
			}
		};
	}

	activateZoom(id: string) {
		console.log('ZOOM', id, this.cast);

		const zoom = this.cast[id].zoom;
		if (!zoom) return () => {};
		window.addEventListener('resize', zoom.resize);
		this.onEndQueue.push(() =>
			window.removeEventListener('resize', zoom.resize)
		);
	}

	onEnd() {
		this.onEndQueue.forEach((fn) => fn());
	}

	private _publish(id: string, updateComponent) {
		return function publish(data: any) {
			const onSceneUpdateComponent = (update: any) => {
				// console.log('onSceneUpdateComponent UPDATE', update);

				if (!this.persos.has(update.id)) {
					if (this.audioCollection.has(update.id)) this.updateAudio(update);
					else console.warn('pas de perso ayant l’id %s', update.id);
					return;
				}
				const perso = this.persos.get(update.id);
				const up = this.onScene.update(update);
				const zoomBox = this.cast[id].zoom.box;
				updateComponent(perso, up, zoomBox, this.updateSlot);
			};
			return (other: any) => onSceneUpdateComponent({ ...data, ...other });
		}.bind(this);
	}

	updateSlot(slotId: string, persosIds: string[]) {
		const content = persosIds.map((id: string) => this.persos.get(id).node);
		this.slots.get(slotId)(content);
	}

	slot(uuid: string) {
		!this.slots.has(uuid) && this.slots.set(uuid, o(null));
		return this.slots.get(uuid);
	}

	updateAudio(update) {
		console.warn('j’ai trouve le son  %s', update.id, update);
		const clip = this.audioCollection.get(update.id);

		console.log();

		update.play && clip.mediaElement.play();
		update.pause && clip.mediaElement.pause();
		// debugger;
	}
}

function concatMaps<K, V>(
	map: Map<K, V>,
	...iterables: Array<Map<K, V>>
): Map<K, V> {
	for (const iterable of iterables) {
		for (const item of iterable) {
			map.set(...item);
		}
	}
	return map;
}
