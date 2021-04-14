import { parseVariables } from './variables-template';

import { SceneCastEntry, Story } from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';

export function resolveTemplateStory(scene: SceneCastEntry) {
	return ({ persos, ...story }: Story): Story => {
		const _persos = resolveTemplate({ scene, story })(persos);

		const _story: Story = parseVariables(story, { scene, story });
		return { ..._story, persos: _persos };
	};
}

interface Context {
	scene?: SceneCastEntry;
	story?: Omit<Story, 'persos'>;
}

export function resolveTemplate(context: Context) {
	return function templatePerso(persos: Perso[]) {
		if (!context.scene) return persos;
		return persos.map(
			(perso: Perso): Perso => parseVariables(perso, { perso, ...context })
		);
	};
}
