import { o, html } from 'sinuous';

import { controlAnimations } from '../shared/control-animation';
import { extractTransform, withTransform } from './transform';

import { isNull } from './utils';

export function tinyEffects(effect, text, oldText) {
	const status = getTextStatus(text, oldText);

	console.log('status, text, oldtext', status, text, oldText);

	const anim = {
		current: {
			content: text,
			interpolation: {
				from: { opacity: 0, y: -100 },
				to: { opacity: 1, y: 0 },
			},
			style: o(),
		},
		old: {
			content: oldText,
			interpolation: {
				from: { opacity: 1, scale: 1, y: 0 },
				to: { opacity: 0, scale: 0, y: 100 },
			},
			style: o(),
		},
	};

	for (const id in anim) {
		const update = render(anim[id].style);
		update(anim[id].interpolation.from);
		controlAnimations.tween({
			id,
			interpolation: anim[id].interpolation,
			update,
		});
	}
	return html`
		<div class="container-text">
			<div class="inner-text-under">
				<span class="x-old-text" style=${anim.old.style}>${oldText}</span>
			</div>
			<div class="inner-text-over">
				<span class="x-new-text" style=${anim.current.style}>${text}</span>
			</div>
		</div>
	`;
}

function render(styler) {
	return function (rendu) {
		const { style, transform } = extractTransform(rendu);
		styler({
			...style,
			...withTransform(transform, 1),
		});
	};
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
