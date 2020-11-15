export const content = {
	update(content, current) {
		return content;
		if (typeof content === 'string' || content instanceof Element)
			return content;
		const { ref, text, lang, refLang, effect } = content;
	},
	prerender() {},
};
