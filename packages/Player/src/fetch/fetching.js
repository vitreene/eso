import YAML from 'yaml';

import { transforms } from './transforms';
import { fetchChapter } from './explore-file';

fetchChapter();

export async function fetchStories(path) {
	const pre = await fetch('/config/defs.yml')
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.catch((err) => console.log('erreur de configuration:', err));

	return await fetch(path)
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.then((text) => pre + text)
		.then((yamlAsString) => YAML.parse(yamlAsString, { prettyErrors: true }))
		.then((json) => transforms(json[1].chapter))
		.catch((err) => console.log('erreur sur la story:', err));
}

// test import json
// ============================================================
// fetch('stories/db.json')
// 	.then((response) => response.json())
// 	.then((data) => console.log('RESPONSE db', data));

// ============================================================
