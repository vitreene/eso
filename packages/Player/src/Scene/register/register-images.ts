import { Nature } from '../../../../types/ESO_enum';
import { ImagesCollection, Perso } from '../../../../types/initial';

import { toArray } from '../../shared/utils';

const composantTypeImage = [Nature.IMG, Nature.SPRITE];

//TODO passer vers fetch !

type Srcs = string[];
export async function registerImages(
	persos: Perso[],
	imagesCollection: ImagesCollection
): Promise<void> {
	const srcs: Srcs = findSrcs(
		persos.filter((perso) => composantTypeImage.includes(perso.nature))
	);
	console.log('src', srcs);
	await loadImages(srcs, imagesCollection);
}

function findSrcs(imgs: Perso[]) {
	const srcs = imgs.map((perso) => perso.initial.content).filter(Boolean);
	for (const perso of imgs) {
		if (!perso.actions) continue;
		toArray(perso.actions).forEach(
			(action) => action.content && srcs.push(action.content)
		);
	}
	return srcs as Srcs;
}
interface ImgSrc {
	src: string;
	fit?: string;
}
export async function loadImages(srcs: string[] | ImgSrc[], imagesCollection) {
	return await Promise.all(
		srcs.map(
			(source) =>
				new Promise((resolve, reject) => {
					const src = typeof source === 'string' ? source : source.src;
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
