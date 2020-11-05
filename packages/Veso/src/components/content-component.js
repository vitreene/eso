export const content = {
	update(content) {
		console.log('content', content);
		return content;
		// return isNaN(content) ? content : content.toString();
	},
	prerender() {},
};
