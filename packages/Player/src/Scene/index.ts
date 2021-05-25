import { o } from 'sinuous';
import { EventEmitter2 } from 'eventemitter2';
import { initVeso } from 'veso';

import { Stage } from '../zoom';
import { Slots } from './store-slots';
import { OnScene, Update } from './on-scene';
import { TimeLiner } from './runtime/timeline';
import { clock, Clock } from './runtime/clock';

import { updateAudio } from './update-audio';
import { registerStraps } from './register/register-straps';
import { registerActions } from './register/register-actions';
import { buildTimeLine, SnapAction, Snapshots } from './build-timeLine';

import { addEventList } from './runtime/add-event-list';

import { TC, PAUSE, APP_ID, DEFAULT_NS } from '../data/constantes';

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
import { findByTime } from './runtime/seek';

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

type Register = (_persos: Perso[]) => ScenePersos;
type UpdatePerso = (
	perso: Eso,
	up: {
		update: any;
		changed: any;
		[x: string]: any;
	},
	box: Box,
	updateSlot: (slotId: string, persosIds: Set<string>) => void
) => void;
export type InitVeso = {
	register: Register;
	update: UpdatePerso;
};

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
	root: string;
	straps: any;
	clock: Clock;
	onEndQueue = [];
	cast: SceneCast = {};
	audio: AudioContext;
	slots: Slots = new Slots(); //
	audioCollection: AudioClips;
	persos: ScenePersos = new Map(); //
	onScene: OnScene = new OnScene();
	persosInTime: Snapshots = new Map();
	timeLine: TimeLiner = new TimeLiner();
	registerPersos: InitVeso;
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

		this.seek = this.seek.bind(this);
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

		this.persosInTime = buildTimeLine({
			stories,
			cast: scene.cast,
			timeLine: this.timeLine,
			esoPersos: this.persos,
		});

		const entry = this.findEntry(stories, scene.cast);
		this.entryInDom(entry).then(() => {
			this.initOnMount(stories, scene.cast);
			this.start();
		});
		// NOTE
		timer(this.emitter, 2550, this.seek);
		// console.log(this.persos);
		// onAny(this.emitter);
	}

	initStories(stories: Story[], entry: string, medias: MediasProps) {
		this.timeLine.addStartEvent();
		this.registerPersos = this._registerComponents(medias);
		stories.sort((s) => (s.id === entry ? -1 : 0)).forEach(this.addStory);
		this.timeLine.addEndEvent();
	}

	findEntry(stories: Story[], casting: Cast[]) {
		const cast: Cast = casting.find((c) => c.isEntry);
		const entry: Story = stories.find((s) => s.id === cast.id);
		return entry;
	}

	initOnMount(stories: Story[], casting: Cast[]) {
		const entry = casting.find((c) => c.isEntry);
		stories
			.filter((s) => s.id !== entry.id)
			.forEach((story) => {
				const cast = casting.find((c) => c.id === story.id);
				this.onMount(story, cast);
			});
	}

	async entryInDom(entry: Story) {
		await new Promise(requestAnimationFrame);
		if (!entry) return;
		const { root } = entry;
		this.root = root;
		this.onMount(entry, { root });
		this.slot(root);
		this.onScene.areOnScene.set(root, root);
		appContainer.innerHTML = '';
		appContainer.appendChild(this.persos.get(root).node);
	}

	onMount(story: Story, cast) {
		console.log('onMount-->', story.id);
		this._setStoryCast(story, cast);
		this.activateZoom(story.id);
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

	addStory(story: Story) {
		const { eventimes, ...others } = story;
		this._addEventsToTimeLine(eventimes);
		this._register(others);
	}

	private _addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	private _register(story: StoryWoEventimes) {
		const { channel, persos } = story;
		const { register, update } = this.registerPersos;
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
			persos: new Set(persos.map((p) => p.id)),
			zoom: new Stage(node, stage, this.renderOnResize(id)),
		};
		this.cast[id].zoom.resize();
	}

	renderOnResize = (storyId: string) => () => {
		for (const id of this.onScene.areOnScene.keys()) {
			this.cast[storyId].persos.has(id) &&
				this.persos.has(id) &&
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

	seek(time: number) {
		const visibles = findVisibles(time, this.persosInTime);
		// arreter la lecture : après start -> pause
		// envoyer les valeurs sur le meme model que _publsh
		this.onScene.areOnScene.clear();
		this.onScene.areOnScene.set(this.root, this.root);
		visibles.forEach((snap, { id, storyId }) => {
			const up = this.onScene.update(snap);
			up.seek = true;
			const perso = this.persos.get(id);
			const zoomBox = this.cast[storyId].zoom.box;
			const before = { ...perso.from };
			this.registerPersos.update(perso, up, zoomBox, this.updateSlot);
			const after = { ...perso.from };
			console.log(id, diff(before, after));
			console.log(id, up);
		});
	}

	private _publish =
		(id: string, updateComponent: UpdatePerso) => (data: Update) => {
			const onSceneUpdateComponent = (update: Update) => {
				// console.log('onSceneUpdateComponent UPDATE', update);
				if (
					!this.persos.has(update.id) &&
					!this.audioCollection.has(update.id)
				) {
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

	updateSlot(slotId: string, persosIds: Set<string>) {
		const content = Array.from(
			persosIds,
			(id: string) => this.persos.get(id).node
		);
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

type SnapActionChono = SnapAction & { chrono: number; entry?: boolean };
type Visibles = Map<
	{ id: string; storyId: string; entry?: boolean },
	SnapActionChono
>;
function findVisibles(time: number, persosInTime: Snapshots): Visibles {
	const viewed: Snapshots = new Map();
	persosInTime.forEach((value, ids) => {
		const { onScene, ...persoInTime } = value;
		if (time > onScene.enter && onScene.exit ? time < onScene.exit : true) {
			const _ids = onScene.entry ? { entry: true, ...ids } : ids;
			viewed.set(_ids, persoInTime);
		}
	});

	const visibles: Visibles = new Map();
	viewed.forEach((snap, ids) => {
		const times = Object.keys(snap).map((t) => Number(t));
		const tKey = findByTime(time, times);
		const update: SnapActionChono = {
			...snap[tKey],
			...(ids.entry && { entry: ids.entry }),
			id: ids.id,
			chrono: time,
		};

		visibles.set(ids, update);
	});
	console.log('SEEK', time, visibles);
	return visibles;
}

function onAny(emitter) {
	emitter.onAny(function (event, value) {
		if (event !== 'elapsed') {
			console.log('EVENT->', event, value);
			// console.log(emitter.listeners(event));
			value === 0 && console.log(emitter.eventNames(event));
		}
	});
}

function timer(emitter, duree = 1000, cb) {
	setTimeout(() => {
		emitter.emit([TC, PAUSE]);
		cb(duree);
	}, duree);
}

function diff(obj1, obj2) {
	const _diff = {};
	for (const k in obj1) {
		if (!obj2[k]) _diff[k] = obj1[k];
		if (obj1[k] !== obj2[k]) _diff[k] = [obj1[k], obj2[k]];
	}
	for (const k in obj2) {
		if (!obj1[k]) _diff[k] = obj2[k];
	}
	return _diff;
}
