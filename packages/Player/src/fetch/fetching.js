import YAML from 'yaml';

import { transforms } from './transforms';
import { pipe } from '../shared/utils';
export function fetchStories(path) {
	fetch(path)
		.then((res) => res.blob())
		.then((blob) => blob.text())
		.then((yamlAsString) => {
			const res = pipe(YAML.parse, transforms)(yamlAsString);
			console.log('yaml res:', JSON.stringify(res, null, 4));
		})
		.catch((err) => console.log('yaml err:', err));
}
