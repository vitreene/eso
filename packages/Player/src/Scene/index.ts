// storeNodes à transférer vers Scene ?
import { o } from 'sinuous';
import { emitter } from '../App/init';

import { Slots } from './store-slots';
import { OnScene } from './on-scene.js';
import { updateComponent } from './update-component';

import { registerImages } from './register/register-images';
import { registerPersos } from './register/register-persos';
import { registerActions } from './register/register-actions';
import { registerStraps } from './register/register-straps';

import { initRuntime } from './runtime';
import { clock, Clock } from './runtime/clock';
import { TimeLiner } from './runtime/solver';
import { addEventList } from './runtime/add-event-list';

import { Stage } from '../zoom';

import { CONTAINER_ESO, DEFAULT_NS, MAIN } from '../data/constantes';
import {
	SceneCast,
	ScenePersos,
	Scene as SceneType,
	Story,
	StoryWoEventimes,
	Cast,
} from '../../../types/Entries-types';
import { ImagesCollection } from '../../../types/initial';
import { Eventime } from '../../../types/eventime';
import { prepareTransistions } from './prepare-transistions';

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

	cast: SceneCast = {};
	persos: ScenePersos = new Map(); //
	slots: Slots = new Slots(); //
	imagesCollection: ImagesCollection = new Map(); //
	straps: any;
	timeLine: TimeLiner = new TimeLiner();
	clock: Clock;
	onScene: OnScene = new OnScene(this.slots);
	// nodes: any = storeNodes;
	// telco: () => {};
	// onStart: () => {};
	// onEnd: () => {};
	onEndQueue = [];

	constructor({ stories, ...scene }: SceneType) {
		this.id = scene.id;
		this.name = scene.name;
		this.description = scene.description;

		this.slot = this.slot.bind(this);
		this.addStory = this.addStory.bind(this);
		this._publish = this._publish.bind(this);
		this._updateSlot = this._updateSlot.bind(this);
		this.renderOnResize = this.renderOnResize.bind(this);

		registerStraps({ cast: () => this.cast });

		Promise.all(stories.map(this.addStory))
			.then(() => this.initOnMount(scene.cast, stories))
			.then(this.start());
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

		console.log(emitter.listeners('main.go1'));

		return _clock.start;
	}

	async addStory(story: Story) {
		const { eventimes, ...others } = story;
		this._addEventsToTimeLine(eventimes);
		await this._register(others);
	}

	private _addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	private async _register(story: StoryWoEventimes) {
		console.log('_register', story);
		const { isEntry, root, channel, persos } = story;
		await registerImages(persos, this.imagesCollection);
		const _persos = persos.map(prepareTransistions);
		registerPersos(_persos, this.persos, {
			imagesCollection: this.imagesCollection,
			slot: this.slot,
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
