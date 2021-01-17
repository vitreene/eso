import { SCENE_STAGE } from '../data/constantes';

type SizeScene = {
	w: number;
	h: number;
	r: number;
};

export class Story {
	id: string = '';
	name: string = '';
	description: string = '';
	cadre: SizeScene = SCENE_STAGE['16/9'];
	zoom: number = 1;
	root: string = '';
	nodes: any[] = [];
	persos: any[] = [];
	straps: any[] = [];
	path?;
	onEnter: () => void;
	onExit: () => void;
	kill: () => void;
}
