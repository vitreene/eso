import { o } from 'sinuous';
import { EventEmitter2 } from 'eventemitter2';
import { initVeso } from 'veso';

import { Stage } from '../zoom';
import { Slots } from './store-slots';
import { OnScene } from './on-scene.js';
import { TimeLiner } from './runtime/timeline';
import { clock, Clock } from './runtime/clock';

import { updateAudio } from './update-audio';
import { registerStraps } from './register/register-straps';
import { registerActions } from './register/register-actions';
import { buildTimeLine } from './build-timeLine';

import { addEventList } from './runtime/add-event-list';

import { TC, MAIN, PAUSE, APP_ID, DEFAULT_NS } from '../data/constantes';

import {
	Cast,
	Story,
	SceneCast,
	ScenePersos,
	StoryWoEventimes,
	Scene as SceneType,
	Eso,
	Box,
} from '../../../types/Entries-types';
import { Message } from '../../../types/message';
import { Eventime } from '../../../types/eventime';
import { ImagesCollection, Perso } from '../../../types/initial';
import { AudioClips } from '../Chapter/register-audios';

export interface SceneOptions {
	messages: Message;
	audio: AudioContext;
	audioCollection?: AudioClips;
	mediasCollection: ImagesCollection;
	connectChapterEmitter: (emitter: EventEmitter2) => void;
}

export type MediasProps = Omit<
	SceneOptions,
	'connectChapterEmitter' | 'audio'
> & {
	slots?: Slots;
};
export type InitVeso = {
	register: (_persos: Perso[]) => ScenePersos;
	update: (
		perso: Eso,
		up: {
			update: any;
			changed: any;
			[x: string]: any;
		},
		box: Box,
		updateSlot: (slotId: string, persosIds: string[]) => void
	) => void;
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
	name?: string;
	channel: string;
	description?: string;
	emitter = new EventEmitter2({
		maxListeners: 0,
		delimiter: '.',
	});
	straps: any;
	clock: Clock;
	onEndQueue = [];
	cast: SceneCast = {};
	audio: AudioContext;
	slots: Slots = new Slots(); //
	audioCollection: AudioClips;
	persos: ScenePersos = new Map(); //
	onScene: OnScene = new OnScene();
	timeLine: TimeLiner = new TimeLiner();
	// telco: () => {};
	// onEnd: () => {};
	// onStart: () => {};

	constructor(
		{ stories, ...scene }: SceneType,
		{
			audio,
			messages,
			audioCollection,
			mediasCollection,
			connectChapterEmitter,
		}: SceneOptions
	) {
		this.id = scene.id;
		this.audio = audio;
		this.name = scene.name;
		this.description = scene.description;
		this.audioCollection = audioCollection;

		console.log('mediasCollection', Array.from(mediasCollection));
		console.log('this.audioCollection', Array.from(this.audioCollection));

		this.slot = this.slot.bind(this);
		this.start = this.start.bind(this);
		this.addStory = this.addStory.bind(this);
		this.updateSlot = this.updateSlot.bind(this);

		connectChapterEmitter(this.emitter);
		registerStraps(this.cast, this.emitter);

		const medias: MediasProps = {
			messages,
			mediasCollection,
		};

		this.slots.subscribe(this.onScene.addSlots);
		this.initStories(stories, scene.entry, medias);
		console.log('this.persos', this.persos);

		buildTimeLine(stories, this.timeLine, this.persos);
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
		this.slot(root);
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
		return _clock.start();
	}

	private _registerComponents({
		messages,
		mediasCollection,
	}: MediasProps): InitVeso {
		const contentTypes = {
			slot: this.slot,
			layer: this.slot,
			text: messages,
			image: mediasCollection,
		};
		return initVeso(this.emitter, contentTypes);
	}

	addStory(registerPersos: InitVeso) {
		return (story: Story) => {
			const { eventimes, ...others } = story;
			this._addEventsToTimeLine(eventimes);
			this._register(others, registerPersos);
		};
	}

	private _addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	private _register(story: StoryWoEventimes, registerPersos: InitVeso) {
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

	renderOnResize = (storyId: string) => () => {
		for (const id of this.onScene.areOnScene.keys()) {
			this.cast[storyId].persos.has(id) &&
				this.persos.get(id).prerender(this.cast[storyId].zoom.box);
		}
	};

	activateZoom(id: string) {
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

	private _publish = (id: string, updateComponent) => (data: any) => {
		const onSceneUpdateComponent = (update: any) => {
			// console.log('onSceneUpdateComponent UPDATE', update);
			if (!this.persos.has(update.id) && !this.audioCollection.has(update.id)) {
				console.warn('pas de perso ayant l’id %s', update.id);
				return;
			}
			const _update = {
				...update,
				...(this.audioCollection.has(update.id) && { sound: true }),
			};

			const up = this.onScene.update(_update);
			if (_update.sound) {
				const clip = this.audioCollection.get(update.id);
				updateAudio(up, clip);
			} else {
				const perso = this.persos.get(update.id);
				const zoomBox = this.cast[id].zoom.box;
				updateComponent(perso, up, zoomBox, this.updateSlot);
			}
		};
		return (other: any) => onSceneUpdateComponent({ ...data, ...other });
	};

	updateSlot(slotId: string, persosIds: string[]) {
		const content = persosIds.map((id: string) => this.persos.get(id).node);
		this.slots.get(slotId)(content);
	}

	slot(uuid: string) {
		!this.slots.has(uuid) && this.slots.set(uuid, o(null));
		return this.slots.get(uuid);
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
