import { Eventime } from './eventime';
import { Perso } from './initial';

export interface SceneEntry {
	defs?: string[];
	scene: Scene;
	stories: Story[];
	persos?: PersoEntry[];
}

export type CastEntry = {
	id?: string;
	startAt: string;
	root: string;
};

export interface Scene {
	id: string;
	name: string;
	entry: string;
	cast: { [ref: string]: CastEntry }[];
}

export interface Story {
	entry: any;
	id: string;
	channel: string;
	root: string;
	isTemplate?: boolean;
	eventimes?: Eventime;
	persos: Perso[];
}

export type StoryWoEventimes = Omit<Story, 'eventimes'>;

export interface StoryEntry {
	id?: string;
	channel?: string;
	root: string;
	isTemplate?: boolean;
	eventimes?: unknown;
	persos?: PersoEntry[];
}

export interface PersoEntry {
	id: string;
	nature: string;
	initial: unknown;
	listen?: unknown;
	actions: unknown;
	emit?: unknown;
}
