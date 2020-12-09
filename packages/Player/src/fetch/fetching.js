import YAML from 'yaml';

import { transforms } from './transforms';
import { pipe } from '../shared/utils';
export async function fetchStories(path) {
	return await fetch(path)
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.then((yamlAsString) => pipe(YAML.parse, transforms)(yamlAsString))
		// console.log('yaml res:', JSON.stringify(res, null, 4));)
		.catch((err) => console.log('erreur sur la story:', err));
}

// test import json
// ============================================================
// fetch('stories/db.json')
// 	.then((response) => response.json())
// 	.then((data) => console.log('RESPONSE db', data));

// ============================================================
