import { html } from 'sinuous';
import { isNull } from '../shared/utils';

const textes = {
	langue: {
		fr: {
			txt01: 'Bonjour',
		},
		en: {
			txt01: 'Hello',
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

export const content = {
	update(content, current) {
		if (isRawContent(content)) return content;
		const {
			ref,
			lang = current?.lang || defaults.lang,
			refLang = current?.refLang || defaults.refLang,
			effect,
		} = content;
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

function tinyEffects(effect, text, oldText) {
	const status = getTextStatus(text, oldText);

	console.log('status, text, oldtext', status, text, oldText);

	return html`
		<div class="container-text">
			<div class="inner-text-under">
				<span class="old-text">${oldText}</span>
			</div>
			<div class="inner-text-over">
				<span class="new-text">${text}</span>
			</div>
		</div>
	`;
}

function getTextStatus(text, oldText) {
	const isText = !isNull(text);
	const isOldText = !isNull(oldText);
	const res = [
		isText && !isOldText && 'enter',
		isText && isOldText && 'update',
		!isText && isOldText && 'leave',
	]
		.filter(Boolean)
		.pop();
	return res;
}

function isRawContent(content) {
	// console.log('content', typeof content, content);
	return !(typeof content === 'object');
}
