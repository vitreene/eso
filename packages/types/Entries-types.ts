import { Eventime } from './eventime';
import { Perso } from './initial';
import { Stage } from '../Player/src/zoom';
import { Eso } from '../Player/src/App/init';
import { Nature } from './ESO_enum';

export interface ChapEntry {
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
	stories?: Story[];
	persos?: PersoEntry[];
}
export interface SceneEntry {
	defs?: string[];
	scene: Scene;
	shared?: {
		stories?: Story[];
		persos?: PersoEntry[];
	};
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
	// cast: { [ref: string]: Cast }[];
	cast: Cast[];
	stories?: Story[];
	shared?: SharedFileEntry;
}

export interface Story {
	extends?: string;
	entry?: any;
	id: string;
	channel: string;
	root: string;
	stage: StageEntry;
	isEntry?: boolean;
	eventimes?: Eventime;
	persos: Perso[];
}

export type StoryWoEventimes = Omit<Story, 'eventimes'>;

// cette interface amene de la confusion ; a reprendre en fin de dev ?
export interface StoryEntry {
	extends?: string;
	entry: any;
	id?: string;
	channel?: string;
	root: string;
	stage?: string | StageEntry;
	isTemplate?: boolean;
	eventimes?: unknown;
	persos?: PersoEntry[] | Perso[];
}

export interface PersoEntry {
	id: string;
	nature: Nature;
	initial: any;
	listen?: any;
	actions: any;
	emit?: any;
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
