import { o, api } from "sinuous";
const { h } = api;

import { Eso } from "../eso";

const src = "./img/Aesthedes.jpg";

const imageCollection = new Map();
loadImages([src]);

async function loadImages(srcs) {
	return await Promise.all(
		srcs.map(
			(src) =>
				new Promise((resolve, reject) => {
					const ikono = new Image();
					ikono.onload = () => {
						imageCollection.set(src, {
							width: ikono.width,
							height: ikono.height,
							ratio: ikono.width / ikono.height,
							src,
						});
						console.log("loadImages", imageCollection);
						resolve(true);
					};
					ikono.onerror = reject;
					ikono.src = src;
				})
		)
	)
		.then(() => imageCollection)
		.catch((err) => console.log("erreur image :", src, err));
}

// cache l'implémentation
const constrainImage = {
	contain: "meet",
	cover: "slice",
	meet: "contain",
	slice: "cover",
	undefined: "slice",
};

export class Img extends Eso {
	static nature = "img";

	// static imageCollection = imageCollection;

	constructor(story, emitter) {
		super(story, emitter);
		this.img;
		this.meetOrSlice = constrainImage[story.initial.fit];
	}

	update(props) {
		super.update(props);
		this.img(imageCollection.get(props.content));
		props.fit && (this.meetOrSlice = constrainImage[props.fit]);
	}

	render(props) {
		this.img = o({});
		// FIXME n'est pas reactif
		const img = this.img();
		console.log("RENDER", img, typeof img);
		const { id, content, ...attrs } = props;
		const viewBox = `0 0 ${img?.width || 0} ${img?.height || 0}`;
		return (
			<svg
				id={props.id}
				{...attrs}
				viewBox={viewBox}
				preserveAspectRatio={"xMidYMid " + (this.meetOrSlice || "slice")}
			>
				<image xlinkHref={img?.src || ""} width="100%" height="100%" />
			</svg>
		);
	}
}
