/*
analyse un fichier et résoud les héritages
file : [scene1, scene2{stories, shared},...,  shared]}
inherit: shared (venant de app, project, chapter
*/

/* 
TODO 
traitement des id quand on crée une instance
post-traitement des variables ${}

*/

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import YAML from 'yaml';

import { Story } from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';
import { exploreFile } from './explore-file';

export type Channel = string | null;
export interface Inherit {
	persos?: Perso[];
	stories?: Story[];
}

const inherit: Inherit = { stories: [], persos: [] };

export async function fetchChapter(path: string) {
	const pre = await fetch('/config/defs.yml')
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.catch((err) => console.log('erreur de configuration:', err));

	const messages = await fetch('/messages/text1.yml')
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.then((yamlAsString) => YAML.parse(yamlAsString, { prettyErrors: true }))
		.catch((err) => console.log('erreur de configuration:', err));

	const scenes = await fetch(path)
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.then((text) => pre + text)
		.then((yamlAsString) => YAML.parse(yamlAsString, { prettyErrors: true }))
		.then((json) => exploreFile(fileToScenes(json), inherit))
		.catch((err) => console.log('erreur sur la story:', err));

	return { scenes, messages };
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
