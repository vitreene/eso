import { tinyEffects } from '../shared/tiny-effects';

const textes = {
	langue: {
		fr: {
			txt01: 'Bonjour',
			txt02: `il est ${new Date()}`,
		},
		en: {
			txt01: 'Hello',
			txt02: 'How are you ?',
		},
	},
	'sous-titre': {
		fr: {
			txt01: 'Jean dit bonjour',
		},
		en: {
			txt01: 'Jean say Hello',
		},
	},
};

const defaults = {
	lang: 'fr',
	refLang: 'langue',
};

// content pourra accepter des nodes
export const content = {
	update(content, current) {
		if (isRawContent(content)) return content;
		const {
			ref,
			lang = current?.lang || defaults.lang,
			refLang = current?.refLang || defaults.refLang,
			effect = current?.effect,
		} = content;

		// console.log('ref,lang,refLang,effect', ref, lang, refLang, effect);

		let text = ref ? textes[refLang][lang][ref] : content.text;

		if (effect) {
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
	// la transition est refaite s'il y a un autre rendu
	prerender(content) {
		if (isRawContent(content)) return content;
		const { text, oldText, effect } = content;
		return tinyEffects(effect, text, oldText);
	},
};

function isRawContent(content) {
	// console.log('content', typeof content, content);
	return !(typeof content === 'object');
}
