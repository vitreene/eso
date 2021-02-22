import { Story, StoryEntry } from '../../../types/Entries-types';

export function mergeStories(
	_stories: StoryEntry[],

	_inherit: Story[]
) {
	console.log('mergeStories', _stories, _inherit);
	if (!_stories.length || !_inherit.length) return _stories;

	const shared = new Map(Array.from(_inherit, (story) => [story.id, story]));
	const stories = new Map(Array.from(_stories, (story) => [story.id, story]));

	for (const [id, _story] of stories) recMerge(id, _story);

	function recMerge(id, _story) {
		const story = stories.get(_story.extends) || shared.get(_story.extends);
		if (!story) return _story;
		const _proto = recMerge(_story.extends, story);
		if (_proto) {
			const { extends: _, ...others } = merge.exe(_proto, _story);
			stories.set(id, others);
		}
		return _story;
	}

	return _stories;
}

const merge = {
	exe(_proto, _story) {
		if (!_proto || Object.keys(_proto).length === 0) return _story;
		if (!_story || Object.keys(_story).length === 0) return _proto;

		const persos = this.persos(_proto.persos, _story.persos);
		const eventimes = this.eventimes(_proto.eventimes, _story.eventimes);

		return Object.assign(_story, persos, eventimes);
	},
	persos(_proto, _story) {
		return _story;
	},
	eventimes(_proto, _story) {
		return _story;
	},
};
