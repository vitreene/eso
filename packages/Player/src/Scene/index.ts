import { Story, StoryWoEventimes } from '../../../types/Entries-types';
import { CollectionImages, Perso } from '../../../types/initial';
import { Eventime } from '../../../types/eventime';

import { DEFAULT_NS } from '../data/constantes';
import { Slots } from './store-slots';
import { OnScene } from './on-scene.js';

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
	nodes: any;
	persos: Map<string, Perso> = new Map();
	slots: Slots = new Slots();
	imagesCollection: Map<string, CollectionImages> = new Map();
	straps: any;
	timeLine: TimeLiner;
	clock: Clock;
	onScene: () => {};
	// telco: () => {};
	// onStart: () => {};
	// onEnd: () => {};

	/* 
	constructor(story: Story) {
		const { eventimes, ...others } = story;

		this.timeLine = new TimeLiner();
		this.onScene = new OnScene(this.slots);

		const start = this._initClock();
		this._addEventsToTimeLine(eventimes);
		registerStraps();
		this._register(others).then(start);
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
		await registerImages(persos);
		registerPersos(persos);
		registerActions(channel, persos);
		initRuntime(root, isTemplate);
	}
  */
}

export const scene = new Scene();
