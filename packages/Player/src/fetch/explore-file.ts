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

import { deepmerge } from './merge';
import { postPersos, prePersos, transformPersos } from './transform-persos';

const inherit = { stories: [], persos: [] };

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
		.then(({ aliases, ...json }) => exploreFile(json, inherit))
		.catch((err) => console.log('erreur sur la story:', err));
}

function exploreFile(file, inherit) {
	// si plusieurs scenes dans le fichier
	// si file est une scene {}
	let scenes;
	let shareds;

	if (Array.isArray(file)) {
		scenes = file.filter((el) => el.scene).map((el) => el.scene);
		shareds = file.filter((el) => el.shared).map((el) => el.shared);
	} else if (typeof file === 'object') {
		scenes = [file];
		shareds = [];
	}

	const _inherit = shareds.reduce((complete, shared) => {
		const _shared = explore(shared, complete);
		return mergeProps(_shared, complete, ['stories', 'persos']);
	}, inherit);

	const _scenes = scenes.map((scene) => exploreScene(scene, _inherit));

	console.log('explore scene', _scenes);
	console.log('============================================================');
}

function exploreScene(scene, inherit) {
	console.log('SCENE :', scene);
	console.log(inherit);

	const sceneShared = explore(scene.shared, inherit);
	const _inherit = mergeProps(sceneShared, inherit, ['stories', 'persos']);
	const stories = scene.stories.map((story) => explore(story, _inherit));

	const { shared, ..._scene } = scene;
	return { ..._scene, stories };
}

function explore(_element, inherit) {
	let sharedPersos;
	let stories;

	if (_element.persos) {
		const _sharedPersos = prePersos(_element.persos);
		sharedPersos = deepmerge(_sharedPersos, inherit?.persos);
	}

	if (_element.stories) {
		stories = _element.stories.map((story) => {
			const _persos = prePersos(story.persos);
			const persos = deepmerge(_persos, [...inherit?.persos, ...sharedPersos]);
			return { ...story, persos };
		});
	}

	return Object.assign(
		{},
		_element,
		stories,
		sharedPersos && { persos: sharedPersos }
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
