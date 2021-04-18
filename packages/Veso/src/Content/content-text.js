// import { Content } from "./index";

import { tinyEffects } from '../shared/tiny-effects';

const defaults = {
	lang: 'fr',
	refLang: 'langue',
};

// content pourra accepter des nodes
export class TextContent {
	static type = 'text';
	content = null;
	collection = null;

	constructor(messages) {
		this.collection = messages;
		this.update = this.update.bind(this);
		this.prerender = this.prerender.bind(this);
	}

	update(content, current) {
		if (!this.collection || isRawContent(content)) return content;

		const {
			ref,
			lang = current?.lang || defaults.lang,
			refLang = current?.refLang || defaults.refLang,
			effect = current?.effect,
		} = content;

		// console.log('ref,lang,refLang,effect', ref, lang, refLang, effect);

		let text = ref ? this.collection[refLang][lang][ref] : content.text;

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
	}

	// mettre tinyEffects en cache
	prerender(content, current) {
		if (isRawContent(content)) return content;
		if (content == this.content) return current;
		this.content = content;

		const { text, oldText, effect } = content;
		return tinyEffects(effect, text, oldText);
	}
}

function isRawContent(content) {
	// console.log('isRawContent', typeof content, content);
	return !(typeof content === 'object');
}
