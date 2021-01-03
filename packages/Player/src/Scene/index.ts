// storeNodes à transférer vers Scene ?
import { Eso, storeNodes } from 'veso';
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
	start: () => void;
	onScene: OnScene = new OnScene(this.slots);
	nodes: any = storeNodes;
	// telco: () => {};
	// onStart: () => {};
	// onEnd: () => {};

	constructor(options) {
		this.id = options.id;
		this.name = options.name;
		this.description = options.description;

		this.slot = this.slot.bind(this);
		this.addStory = this.addStory.bind(this);
		this.publish = this.publish.bind(this);
		this._updateSlot = this._updateSlot.bind(this);

		this.start = this._initClock();
		registerStraps();
	}

	async addStory(story: Story) {
		const { eventimes, ...others } = story;
		this._addEventsToTimeLine(eventimes);
		await this._register(others);
	}

	publish(data: any) {
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

	slot(uuid: string) {
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
		registerPersos(persos, this.persos, {
			imagesCollection: this.imagesCollection,
			slot: this.slot,
		});
		registerActions(channel, persos, this.publish);
		initRuntime(root, isTemplate, this.persos, this.onScene);
	}
	_updateSlot(slotId: string, persosIds: string[]) {
		const content = persosIds.map((id: string) =>
			this.nodes.get(this.persos.get(id).uuid)
		);
		this.slots.get(slotId)(content);
	}
}
