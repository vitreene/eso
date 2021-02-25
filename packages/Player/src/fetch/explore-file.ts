/*
analyse un fichier et résoud les héritages
file : [scene1, scene2{stories, shared},...,  shared]}
inherit: shared (venant de app, project, chapter
*/

/* 
TODO merge stories
ajouter les transformations manquantes;
traitement des id quand on crée une instance
post-traitement des variables ${}

*/

// @ts-ignore
import YAML from 'yaml';
import {
	PersoEntry,
	Scene,
	SharedFileEntry,
	Story,
	StoryEntry,
} from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';

import { mergePersos } from './merge-persos';
import { mergeStories } from './merge-stories';
import { postPersos, prePersos, transformPersos } from './transform-persos';

interface Inherit {
	persos?: Perso[];
	stories?: Story[];
}

interface SceneEntry {
	defs?: string[];
	scene: Scene;
	stories?: StoryEntry[];
	shared?: Inherit;
}
const inherit: Inherit = { stories: [], persos: [] };

const path = '/stories/App02.yml';
export async function fetchChapter() {
	const pre = await fetch('/config/defs.yml')
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.catch((err) => console.log('erreur de configuration:', err));

	return await fetch(path)
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.then((text) => pre + text)
		.then((yamlAsString) => YAML.parse(yamlAsString, { prettyErrors: true }))
		.then((json) => exploreFile(fileToScenes(json), inherit))
		.catch((err) => console.log('erreur sur la story:', err));
}

/* 
file : [ Scene, Scene, ... Inherit ]
obj: { scenes [Scene, Scene,], shared : Inherit}

*/

function fileToScenes(file: any) {
	if (!Array.isArray(file)) return file;
	const obj = { scene: [], shared: undefined };
	for (const el of file) {
		for (const property in el) {
			if (!obj[property]) obj[property] = el[property];
			else if (obj[property] && !Array.isArray(obj[property]))
				obj[property] = [obj[property], el[property]];
			else {
				obj[property].push(el[property]);
			}
		}
	}
	return obj;
}

function exploreFile(file: SceneEntry, inherit: Inherit) {
	// si plusieurs scenes dans le fichier
	// si file est une scene {}
	console.log('exploreFile', file);

	const scenes: Scene[] = Array.isArray(file.scene) ? file.scene : [file.scene];
	const shareds: Inherit[] = Array.isArray(file.shared)
		? file.shared
		: [file.shared];

	const _inherit = shareds.reduce((complete, shared) => {
		const _shared = exploreShared(shared, complete);
		return mergeProps(_shared, complete, ['stories', 'persos']);
	}, inherit);

	const _scenes = scenes.map((scene) => exploreScene(scene, _inherit));

	console.log('explore scene', _scenes);
	console.log('============================================================');
}

function exploreScene(scene, inherit) {
	console.log('SCENE :', scene);
	console.log(inherit);

	const sceneShared = exploreShared(scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);

	const stories = exploreStory(scene.stories, _inherit);

	const { shared, ..._scene } = scene;
	return { ..._scene, stories };
}

function exploreStory(_stories: Story[], inherit: Inherit) {
	const stories = _stories.map((_story) => {
		let persos: Perso[];
		if (_story.persos) {
			const _sharedPersos = prePersos(_story.persos);
			persos = mergePersos(_sharedPersos, inherit?.persos);
		}
		return { ..._story, persos };
	});
	return stories;
}
function exploreShared(_scene: SharedFileEntry, inherit: Inherit) {
	let persos: Perso[];
	let stories: StoryEntry[];

	if (_scene.persos) {
		const _sharedPersos = prePersos(_scene.persos);
		persos = mergePersos(_sharedPersos, inherit?.persos);
	}

	if (_scene.stories) {
		stories = _scene.stories.map((story) => {
			const _persos = prePersos(story.persos);
			const __persos = mergePersos(_persos, [...inherit?.persos, ...persos]);

			return { ...story, persos: __persos };
		});
		stories = mergeStories(stories, inherit.stories);
	}

	console.log('exploreShared', stories);

	return Object.assign(
		{},
		_scene,
		stories && stories.length && { stories },
		persos && persos.length && { persos }
	);
}

// merge deux objets dont les props sont un tableau ou undefined
function mergeProps(obj1, obj2, props) {
	const res = {};
	for (const prop of props) {
		const arr1 = obj1[prop] || [];
		const arr2 = obj2[prop] || [];
		res[prop] = arr1.concat(arr2);
	}
	return res;
}
