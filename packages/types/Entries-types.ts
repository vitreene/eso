import { Eventime } from './eventime';
import { Perso } from './initial';
import { Stage } from '../Player/src/zoom';
import { Eso } from '../Player/src/App/init';

export interface SceneEntry {
	defs?: string[];
	scene: Scene;
	stories?: StoryEntry[];
	prototypes: {
		stories?: Story[];
		persos?: PersoEntry[];
	};
}
export interface SceneFileEntry {
	defs?: string[];
	scenes: Scene[];
	stories?: StoryEntry[];
}
export interface SharedFileEntry {
	defs?: string[];
	stories?: StoryEntry[];
	persos?: PersoEntry[];
}

export type Cast = {
	id?: string;
	startAt: string;
	root: string;
};

export interface Scene {
	id: string;
	name: string;
	entry: string;
	cast: { [ref: string]: Cast }[];
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

export type ScenePersos = Map<string, Eso>;
