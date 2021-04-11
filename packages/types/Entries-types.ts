import { Eventime } from './eventime';
import { Perso } from './initial';
import { Stage } from '../Player/src/zoom';
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
	scene: SceneCastEntry;
	shared?: {
		stories?: Story[];
		persos?: PersoEntry[];
	};
}
export type Cast = {
	id?: string;
	startAt: string | number;
	root: string;
	isEntry?: boolean;
};

export type CastEntry =
	| {
			[id: string]: {
				startAt: string | number;
				root: string;
				isEntry?: boolean;
			};
	  }
	| string;

export interface SceneCastEntry extends Omit<Scene, 'cast'> {
	cast: CastEntry[];
}
export interface Scene {
	id: string;
	name?: string;
	description?: string;
	entry: string;
	cast: Cast[];
	stories?: Story[];
	shared?: SharedFileEntry;
	lastEvent?: string;
}

export interface Story {
	id: string;
	root: string;
	channel: string;
	persos: Perso[];
	stage: StageEntry;
	entry?: string;
	extends?: string;
	ignore?: string[];
	isEntry?: boolean;
	isSceneEntry?: boolean;
	eventimes?: Eventime;
}

export type StoryWoEventimes = Omit<Story, 'eventimes'>;

// cette interface amene de la confusion ; a reprendre en fin de dev ?
export interface StoryEntry {
	extends?: string;
	ignore?: string[];
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

export interface Eso {
	node: Element;
	prerender: (box: Box) => void;
}
