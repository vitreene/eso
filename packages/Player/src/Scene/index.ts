// storeNodes à transférer vers Scene ?
import { Eso, storeNodes } from 'veso';
import { o } from 'sinuous';

import { Story, StoryWoEventimes } from '../../../types/Entries-types';
import { CollectionImages, Perso } from '../../../types/initial';
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
import { clock } from './runtime/clock';
import { TimeLiner } from './runtime/solver';
import { addEventList } from './runtime/add-event-list';

type Clock = {
	start(): void;
	chrono(): number;
};

export class Scene {
	id: string;
	channel: string;
	name?: string;
	description?: string;

	cast: Story[];
	persos: Map<string, Eso> = new Map(); //
	slots: Slots = new Slots(); //
	imagesCollection: Map<string, CollectionImages> = new Map(); //
	straps: any;
	timeLine: TimeLiner = new TimeLiner();
	clock: Clock;
	start: () => void;
	onScene: OnScene = new OnScene(this.slots);
	nodes: any = storeNodes;
	// telco: () => {};
	// onStart: () => {};
	// onEnd: () => {};

	constructor() {
		this.slot = this.slot.bind(this);
		this.addStory = this.addStory.bind(this);
		this.onSceneUpdateComponent = this.onSceneUpdateComponent.bind(this);
		this._updateSlot = this._updateSlot.bind(this);

		this.start = this._initClock();
		registerStraps();
	}

	async addStory(story: Story) {
		const { eventimes, ...others } = story;
		this._addEventsToTimeLine(eventimes);
		await this._register(others);
	}

	onSceneUpdateComponent(update) {
		if (!this.persos.has(update.id)) {
			console.warn('pas de perso ayant l’id %s', update.id);
			return;
		}
		const perso = this.persos.get(update.id);
		const up = this.onScene.update(update);
		updateComponent(perso, up, this._updateSlot);
	}

	slot(uuid) {
		!this.slots.has(uuid) && this.slots.set(uuid, o(null));
		return this.slots.get(uuid);
	}

	_initClock() {
		this.clock = clock(this.timeLine);
		addEventList(this.clock.chrono, this.timeLine);
		return this.clock.start;
	}

	_addEventsToTimeLine(eventimes: Eventime) {
		this.timeLine.addEventList(eventimes, { level: DEFAULT_NS });
	}

	async _register(story: StoryWoEventimes) {
		const { isTemplate, root, channel, persos } = story;
		await registerImages(persos, this.imagesCollection);
		registerPersos(persos, this.persos, this.imagesCollection);
		registerActions(channel, persos);
		initRuntime(root, isTemplate, this.persos, this.onScene);
	}
	_updateSlot(slotId: string, persosIds: string[]) {
		const content = persosIds.map((id: string) =>
			this.nodes.get(this.persos.get(id).uuid)
		);
		this.slots.get(slotId)(content);
	}
}

export const scene = new Scene();
