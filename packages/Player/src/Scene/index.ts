// storeNodes à transférer vers Scene ?
import { o } from 'sinuous';
import { emitter } from '../App/init';

import { Stage } from '../zoom';
import { Slots } from './store-slots';
import { OnScene } from './on-scene.js';
import { updateComponent } from './update-component';

import { registerPersos } from './register/register-persos';
import { registerStraps } from './register/register-straps';
import { registerActions } from './register/register-actions';

import { initRuntime } from './runtime';
import { TimeLiner } from './runtime/solver';
import { clock, Clock } from './runtime/clock';
import { addEventList } from './runtime/add-event-list';

import { CONTAINER_ESO, DEFAULT_NS, MAIN } from '../data/constantes';

import {
	SceneCast,
	ScenePersos,
	Scene as SceneType,
	Story,
	StoryWoEventimes,
	Cast,
} from '../../../types/Entries-types';
import { Message } from '../../../types/message';
import { Eventime } from '../../../types/eventime';
import { prepareTransistions } from './prepare-transistions';
import { ImagesCollection } from '../../../types/initial';

// emitter.onAny(function (event, value) {
// 	console.log('EVENT->', event, value);
// 	console.log(emitter.listeners(event));
// 	console.log(emitter.eventNames());
// });

export class Scene {
	id: string;
	channel: string;
	name?: string;
	description?: string;

	straps: any;
	clock: Clock;
	cast: SceneCast = {};
	messages: Message;
	slots: Slots = new Slots(); //
	persos: ScenePersos = new Map(); //
	timeLine: TimeLiner = new TimeLiner();
	onScene: OnScene = new OnScene(this.slots);
	// imagesCollection; //: ImagesCollection = new Map();
	// nodes: any = storeNodes;
	// telco: () => {};
	// onStart: () => {};
	// onEnd: () => {};
	onEndQueue = [];

	constructor(
		{ stories, ...scene }: SceneType,
		{ messages, mediasCollection, connectChapterEmitter }
	) {
		this.id = scene.id;
		this.name = scene.name;
		this.messages = messages;
		this.description = scene.description;

		this.slot = this.slot.bind(this);
		this.addStory = this.addStory.bind(this);
		this._publish = this._publish.bind(this);
		this._updateSlot = this._updateSlot.bind(this);
		this.renderOnResize = this.renderOnResize.bind(this);

		registerStraps({ cast: () => this.cast });

		stories.forEach(this.addStory(mediasCollection));
		this.initOnMount(scene.cast, stories);
		connectChapterEmitter(emitter);
		this.start();
	}

	initOnMount(_cast: Cast[], stories: Story[]) {
		for (const cast of _cast) {
			const story = stories.find((s) => s.id === cast.id);
			emitter.prependListener([MAIN, cast.startAt], this.onMount(story));
		}
	}

	onMount(story: Story) {
		return () => {
			console.log('onMount-->', story.id);
			this._setStoryCast(story);
			this.activateZoom(story.id);
			console.log(this.cast);
		};
	}

	start() {
		const _clock = clock(this.timeLine);
		addEventList(_clock.chrono, this.timeLine);
		console.log('START', emitter.eventNames());
		return _clock.start();
	}

	addStory(mediasCollection) {
		return (story: Story) => {
			const { eventimes, ...others } = story;
			this._addEventsToTimeLine(eventimes);
			this._register(others, mediasCollection);
		};
	}
	private _addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	private _register(
		story: StoryWoEventimes,
		mediasCollection: ImagesCollection
	) {
		// console.log('_register', story);
		// console.log('this.imagesCollection', this.imagesCollection);

		const { isEntry, root, channel, persos } = story;
		const _persos = persos.map(prepareTransistions);
		registerPersos(_persos, this.persos, {
			imagesCollection: mediasCollection,
			slot: this.slot,
			messages: this.messages,
		});
		registerActions(channel, _persos, this._publish(story.id));

		initRuntime(root, isEntry, this.persos, this.onScene);
	}

	/* 
	Cette fonction ne devrait-elle pas etre activée seulement lorsque un élément entre en scene ? cela permattrait de trouver un slot 
	ou : un slot sera forcément un perso, donc disponible ici
	
	*/
	private _setStoryCast({ id, root = CONTAINER_ESO, stage, persos }: Story) {
		// TODO a terme, les slots sont des persos
		//FIXME si root est un slot, il n'est pas accesible ici et maintenant
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

	private _publish(id) {
		function publish(data: any) {
			const onSceneUpdateComponent = (update: any) => {
				if (!this.persos.has(update.id)) {
					console.warn('pas de perso ayant l’id %s', update.id);
					return;
				}
				const perso = this.persos.get(update.id);
				const up = this.onScene.update(update);
				const zoom = this.cast[id].zoom.box;
				updateComponent(perso, up, zoom, this._updateSlot);
			};

			return (other: any) => onSceneUpdateComponent({ ...data, ...other });
		}

		return publish.bind(this);
	}

	private _updateSlot(slotId: string, persosIds: string[]) {
		const content = persosIds.map((id: string) => this.persos.get(id).node);
		this.slots.get(slotId)(content);
	}

	slot(uuid: string) {
		!this.slots.has(uuid) && this.slots.set(uuid, o(null));
		return this.slots.get(uuid);
	}
}
