import { Story, StoryEntry } from '../../../types/Entries-types';
import { Perso } from '../../../types/initial';

export function mergeStories(_stories: Story[], _inherit: Story[]) {
	if (!_stories.length || !_inherit.length) return _stories;

	const shared = new Map(Array.from(_inherit, (story) => [story.id, story]));
	const stories = new Map(Array.from(_stories, (story) => [story.id, story]));

	console.log('mergeStories', shared, stories);

	for (const [id, _story] of stories) recMerge(id, _story);

	// FIXME ne merge pas
	function recMerge(id: string, _story: StoryEntry) {
		const story = stories.get(_story.extends) || shared.get(_story.extends);

		if (!story) return _story;
		const _proto = recMerge(_story.extends, story);
		if (_proto) {
			const { extends: _, ...others } = merge.exe(_proto, _story);
			stories.set(id, others);
		}
		return _story;
	}

	return Array.from(stories.values());
}

const merge = {
	exe(_proto, _story) {
		if (!_proto || Object.keys(_proto).length === 0) return _story;
		if (!_story || Object.keys(_story).length === 0) return _proto;

		const persos = this.persos(_proto.persos, _story.persos);
		const eventimes = this.eventimes(_proto.eventimes, _story.eventimes);

		return Object.assign(
			{},
			_proto,
			_story,
			{ eventimes },
			persos && persos.length && { persos }
		);
	},
	persos(_protos, _persos: Perso[]) {
		const persos = new Map(Array.from(_persos, (perso) => [perso.id, perso]));
		for (const p of _protos) !persos.has(p.id) && persos.set(p.id, p);

		return Array.from(persos.values());
	},
	eventimes(_proto, _story) {
		return _proto;
	},
};
