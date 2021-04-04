// storeNodes à transférer vers Scene ?
import { o } from 'sinuous';
// import { emitter } from '../App/init';
import { createEso } from 'veso';
import { initCreatePerso } from '../composants';

import { Stage } from '../zoom';
import { Slots } from './store-slots';
import { OnScene } from './on-scene.js';
import { updateComponent } from './update-component';

import { registerPersos } from './register/register-persos';
import { registerStraps } from './register/register-straps';
import { registerActions } from './register/register-actions';

import { TimeLiner } from './runtime/timeline';
import { clock, Clock } from './runtime/clock';
import { addEventList } from './runtime/add-event-list';
import { prepareTransitions } from './prepare-transitions';
import { mergeDimensions } from '../Scene/pre/dimensions';

import {
	APP_ID,
	CONTAINER_ESO,
	DEFAULT_NS,
	MAIN,
	PAUSE,
	TC,
} from '../data/constantes';

import {
	SceneCast,
	ScenePersos,
	Scene as SceneType,
	Story,
	StoryWoEventimes,
	Cast,
	Eso,
} from '../../../types/Entries-types';
import { Message } from '../../../types/message';
import { Eventime } from '../../../types/eventime';
import { ImagesCollection } from '../../../types/initial';
import { EventEmitter2 } from 'eventemitter2';

/* emitter.onAny(function (event, value) {
	if (event !== 'elapsed') {
		console.log('EVENT->', event, value);
		// console.log(emitter.listeners(event));
		console.log(emitter.eventNames(event));
	}
}); */
// setTimeout(() => {
// 	emitter.emit([TC, PAUSE]);
// }, 3000);

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

	Eso = createEso(this.emitter, { mergeDimensions });
	createPerso = initCreatePerso(this.Eso);
	straps: any;
	clock: Clock;
	messages: Message;
	cast: SceneCast = {};
	slots: Slots = new Slots(); //
	persos: ScenePersos = new Map(); //
	timeLine: TimeLiner = new TimeLiner();
	onScene: OnScene = new OnScene(this.slots);
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

		connectChapterEmitter(this.emitter);
		registerStraps(this.cast, this.emitter);

		this.initStories(stories, scene.entry, mediasCollection);
		document.getElementById(APP_ID).innerHTML = '';
		this.initOnMount(scene.cast, stories);
		this.start();
	}

	initStories(
		stories: Story[],
		entry: string,
		mediasCollection: ImagesCollection
	) {
		this.timeLine.addStartEvent();
		stories
			.sort((s) => (s.id === entry ? -1 : 0))
			.forEach(this.addStory(mediasCollection));
		this.timeLine.addEndEvent();
	}

	initOnMount(casting: Cast[], stories: Story[]) {
		for (const cast of casting) {
			const story = stories.find((s) => s.id === cast.id);
			this.emitter.prependListener(
				[MAIN, cast.startAt.toString()],
				this.onMount(story)
			);
			if (cast.isEntry) {
				const { root } = story;
				appContainer.appendChild(this.persos.get(root).node);
				this.slot(root);
				this.onScene.areOnScene.set(root, root);
			}
		}
	}

	onMount(story: Story) {
		return () => {
			console.log('onMount-->', story.id);
			this._setStoryCast(story);
			this.activateZoom(story.id);
		};
	}

	start() {
		const _clock = clock(this.timeLine, this.emitter);
		addEventList(_clock.chrono, this.timeLine, this.emitter);
		// console.log('START', emitter.eventNames());
		return _clock.start();
	}

	addStory(mediasCollection: ImagesCollection) {
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
		const { channel, persos } = story;
		const _persos = persos.map(prepareTransitions);
		console.log(persos);

		registerPersos(_persos, this.persos, this.createPerso, {
			imagesCollection: mediasCollection,
			slot: this.slot,
			messages: this.messages,
		});
		registerActions(channel, _persos, this._publish(story.id), this.emitter);
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

	private _publish(id: string) {
		function publish(data: any) {
			const onSceneUpdateComponent = (update: any) => {
				// console.log('onSceneUpdateComponent', id, this.cast, update);

				if (!this.persos.has(update.id)) {
					console.warn('pas de perso ayant l’id %s', update.id);
					return;
				}
				const perso = this.persos.get(update.id);
				const up = this.onScene.update(update);
				const zoom = this.cast[id].zoom.box;
				updateComponent(perso, up, zoom, this._updateSlot, this.Eso);
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
