import { tinyEffects } from '../shared/tiny-effects';

const defaults = {
	lang: 'fr',
	refLang: 'langue',
};

// content pourra accepter des nodes
export const content = (options) => ({
	content: null,
	update(content, current) {
		if (!options || isRawContent(content)) return content;

		const {
			ref,
			lang = current?.lang || defaults.lang,
			refLang = current?.refLang || defaults.refLang,
			effect = current?.effect,
		} = content;

		// console.log('ref,lang,refLang,effect', ref, lang, refLang, effect);

		let text = ref ? options.messages[refLang][lang][ref] : content.text;

		if (current && effect) {
			text = {
				text,
				oldText: typeof current === 'string' ? current : current.text,
				effect,
				lang,
				refLang,
			};
		}
		return text;
	},

	// mettre tinyEffects en cache
	prerender(content, current) {
		const c = typeof content === 'function' ? content() : content;
		console.log(c, 'ANCIEN prerender');
		if (isRawContent(content)) return content;
		if (content == this.content) return current;
		this.content = content;

		const { text, oldText, effect } = content;
		return tinyEffects(effect, text, oldText);
	},
});

function isRawContent(content) {
	// console.log('isRawContent', typeof content, content);
	return !(typeof content === 'object');
}
