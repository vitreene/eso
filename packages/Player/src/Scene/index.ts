// storeNodes à transférer vers Scene ?
import { Eso } from 'veso';
import { o } from 'sinuous';

import { Story, StoryWoEventimes } from '../../../types/Entries-types';
import { ImagesCollection } from '../../../types/initial';
import { Eventime } from '../../../types/eventime';

import { DEFAULT_NS } from '../data/constantes';
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

export class Scene {
	id: string;
	channel: string;
	name?: string;
	description?: string;

	cast: Story[];
	persos: Map<string, Eso> = new Map(); //
	slots: Slots = new Slots(); //
	imagesCollection: ImagesCollection = new Map(); //
	straps: any;
	timeLine: TimeLiner = new TimeLiner();
	clock: Clock;
	onScene: OnScene = new OnScene(this.slots);
	// start: () => void;
	// nodes: any = storeNodes;
	// telco: () => {};
	// onStart: () => {};
	// onEnd: () => {};

	constructor({ scene, stories }) {
		this.id = scene.id;
		this.name = scene.name;
		this.description = scene.description;
		// this.cast = createRoots(scene.cast)

		this.slot = this.slot.bind(this);
		this.addStory = this.addStory.bind(this);
		this._publish = this._publish.bind(this);
		this._updateSlot = this._updateSlot.bind(this);

		registerStraps();
		Promise.all(stories.map(this.addStory)).then(this.start());
	}

	// Promise.all(stories.map(this.addStory)).then(this._initClock());
	// _initClock() {
	// 	this.clock = clock(this.timeLine);
	// 	addEventList(this.clock.chrono, this.timeLine);
	// 	return this.clock.start;
	// }

	start() {
		const _clock = clock(this.timeLine);
		addEventList(_clock.chrono, this.timeLine);
		return _clock.start;
	}
	/* 
	pour chaque story
	- root
	- zoom
	
	*/
	async addStory(story: Story) {
		const { eventimes, ...others } = story;
		console.log(others);

		this._addEventsToTimeLine(eventimes);
		await this._register(others);
	}

	_addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	async _register(story: StoryWoEventimes) {
		const { isTemplate, root, channel, persos } = story;
		await registerImages(persos, this.imagesCollection);
		registerPersos(persos, this.persos, {
			imagesCollection: this.imagesCollection,
			slot: this.slot,
		});
		registerActions(channel, persos, this._publish);
		initRuntime(root, isTemplate, this.persos, this.onScene);
	}

	_publish(data: any) {
		const onSceneUpdateComponent = (update: any) => {
			if (!this.persos.has(update.id)) {
				console.warn('pas de perso ayant l’id %s', update.id);
				return;
			}
			const perso = this.persos.get(update.id);
			const up = this.onScene.update(update);
			updateComponent(perso, up, this._updateSlot);
		};
		return (other: any) => onSceneUpdateComponent({ ...data, ...other });
	}

	// si uuid devient un path, je sais ou chercher un élément sans centraliser
	slot(uuid: string) {
		!this.slots.has(uuid) && this.slots.set(uuid, o(null));
		return this.slots.get(uuid);
	}

	_updateSlot(slotId: string, persosIds: string[]) {
		const content = persosIds.map((id: string) => this.persos.get(id).node);
		this.slots.get(slotId)(content);
	}
}
