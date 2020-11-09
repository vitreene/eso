import { imagesCollection } from '../data/images-collection';
const composantTypeImage = ['img', 'sprite'];

export async function registerImages(stories) {
	const srcs = findSrcs(
		stories.filter((story) => composantTypeImage.includes(story.nature))
	);
	console.log('src', srcs);
	await loadImages(srcs);
}

function findSrcs(imgs) {
	const srcs = imgs.map((story) => story.initial.content).filter(Boolean);
	for (const story of imgs) {
		story.actions &&
			story.actions.forEach(
				(action) => action.content && srcs.push(action.content)
			);
	}
	return srcs;
}
export async function loadImages(srcs) {
	return await Promise.all(
		srcs.map(
			(src) =>
				new Promise((resolve, reject) => {
					const ikono = new Image();
					ikono.onload = () => {
						imagesCollection.set(src, {
							width: ikono.width,
							height: ikono.height,
							ratio: ikono.width / ikono.height,
							src,
						});
						resolve(true);
					};
					ikono.onerror = reject;

					ikono.src = src;
				})
		)
	).catch((err) => console.log('erreur image :', err));
}
