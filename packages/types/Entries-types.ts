import { Eventime } from './eventime';
import { Perso } from './initial';
import { Stage } from '../Player/src/zoom';

export interface SceneEntry {
	defs?: string[];
	scene: Scene;
	stories?: Story[];
	prototypes: {
		stories?: Story[];
		persos?: PersoEntry[];
	};
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
	stage: StageEntry;
	isTemplate?: boolean;
	eventimes?: Eventime;
	persos: Perso[];
}

export type StoryWoEventimes = Omit<Story, 'eventimes'>;

export interface StoryEntry {
	id?: string;
	channel?: string;
	root: string;
	stage?: string | StageEntry;
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

export interface StageEntry {
	w: number;
	h: number;
	r: number;
}

export type SceneCast = {
	[key: string]: { zoom: Stage; persos: Set<string> };
};
export type Box = {
	left: number;
	top: number;
	width: number;
	height: number;
	ratio: number;
	zoom: number;
};
