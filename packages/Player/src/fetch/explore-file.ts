/* 
ATTENTION : la structure de la scene est sensiblement différente de la version "transform": 
- prototype devient shared
- un objet shared existe dans une scene
- stories est intégré à scene
[x] cast doit etre crée automatiquement  à partir de scene s'il n'existe pas

*/

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
	Cast,
	PersoEntry,
	Scene,
	SceneEntry,
	SharedFileEntry,
	Story,
} from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';

import { mergePersos } from './merge-persos';
import { mergeStories } from './merge-stories';
import {
	dispatchPersoProps,
	filterProtos,
	prePersos,
} from './transform-persos';
import {
	getEntry,
	getStories,
	preStory,
	sceneCreateCast,
	sceneExpandCast,
} from './transforms';

interface Inherit {
	persos?: Perso[];
	stories?: Story[];
}

const inherit: Inherit = { stories: [], persos: [] };

// const path = '/stories/App20.yml';
export async function fetchChapter(path) {
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

/**  
@params file  [ Scene, Scene, ..., Inherit ]
@result obj { scenes [Scene, Scene,], shared : Inherit}
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

export function exploreFile(file: SceneEntry, inherit: Inherit) {
	console.log('exploreFile', file);
	// si plusieurs scenes dans le fichier
	// si file est une scene {}
	const _scenes: Scene[] = Array.isArray(file.scene)
		? file.scene
		: [file.scene];
	const shareds: Inherit[] = Array.isArray(file.shared)
		? file.shared
		: [file.shared];
	const _inherit = shareds.reduce((complete, shared) => {
		const _shared = exploreShared(shared, complete);
		return mergeProps(_shared, complete, ['stories', 'persos']);
	}, inherit);

	const scenes: Scene[] = _scenes.map((scene) => exploreScene(scene, _inherit));

	console.log('explore scene', scenes);
	console.log('============================================================');
	return scenes;
}

function exploreScene(scene: Scene, inherit: Inherit) {
	console.log('SCENE :', scene);
	console.log(inherit);
	const sceneShared = exploreShared(scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);

	const _stories = exploreStories(scene.stories, _inherit);
	const cast: Cast[] = sceneExpandCast(scene.cast) || sceneCreateCast(_stories);
	const entry = getEntry(scene.entry)(_stories);
	const casting = getStories(cast)(_stories);

	const { shared, ..._scene } = scene;
	const stories = [entry, ...casting].filter(Boolean);
	return { ..._scene, cast, stories };
}

function exploreStories(_stories: Story[], inherit: Inherit): Story[] {
	if (!_stories) return;

	let stories: Story[];
	stories = preStory(_stories);
	stories = stories.map(explorePersos(inherit?.persos));
	stories = mergeStories(stories, inherit.stories);
	return stories;
}

type Channel = string | null;

function explorePersos(inherit: Perso[]) {
	return function explorePersosInherit(_story: Story) {
		if (!_story.persos) return _story;

		const channel: Channel = _story.channel || null;
		let persos: Perso[];
		const _persos = prePersos(_story.persos);
		console.log('prePersos', _persos);

		persos = dispatchPersoProps(channel)(_persos);
		console.log('dispatchPersoProps', persos);

		persos = mergePersos(persos, inherit);
		console.log('mergePersos', persos);
		persos = filterProtos(persos);
		console.log('filterProtos', persos);

		return { ..._story, persos };
	};
}

function exploreShared(_scene: SharedFileEntry, inherit: Inherit) {
	if (!_scene) return null;
	let persos: Perso[];
	let stories: Story[];
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
		stories = mergeStories(stories as Story[], inherit.stories);
	}
	return Object.assign(
		{},
		_scene,
		stories && stories.length && { stories },
		persos && persos.length && { persos }
	);
}

// merge deux objets dont les props sont un tableau ou undefined
function mergeProps(obj1, obj2, props) {
	if (!obj1) return obj2;
	if (!obj2) return obj1;
	const res = {};
	for (const prop of props) {
		const arr1 = obj1[prop] || [];
		const arr2 = obj2[prop] || [];
		res[prop] = arr1.concat(arr2);
	}
	return res;
}
