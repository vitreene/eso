import { o, html } from 'sinuous';
import { nanoid } from 'nanoid';

import { controlAnimations } from '../shared/control-animation';
import { extractTransform, withTransform } from './transform';
import { getCssValue } from './colors';

import { isNull } from './utils';
import { tinyEffectsPresets } from '../presets/tiny-effects-presets';

export function tinyEffects(effect, current, old) {
	const status = getTextStatus(current, old);

	const { stagger = 50, portee = 'all', presets } = tinyEffectsPresets[effect];

	const anim = {};
	for (const { id, interpolation } of presets) anim[id] = { interpolation };

	console.log('status, current, old', status, current, old);

	const _id = nanoid(6);

	// parties communes
	for (const [id, text] of Object.entries({ old, current })) {
		let content = null;
		let style = null;
		let list = null;

		if (portee === 'all') {
			content = text;
			style = o();
		} else {
			list = text.split('').map((char) => ({ char, style: o() }));
			content = List(list);
		}

		// adapter les couleurs
		const { interpolation } = anim[id];
		for (const item in interpolation)
			for (const key in interpolation[item])
				interpolation[item][key] = getCssValue(interpolation[item][key]);

		anim[id] = {
			...anim[id],
			id: `${id}-${_id}`,
			list,
			content,
			style,
		};
	}

	if (portee === 'all') {
		for (const el in anim) {
			const update = renderUpdate(anim[el].style);
			update(anim[el].interpolation.from);
			controlAnimations.tween({
				id: anim[el].id,
				interpolation: anim[el].interpolation,
				update,
			});
		}
	} else {
		for (const item in anim) {
			const an = anim[item];
			an.list.forEach((el, index) => {
				const update = renderUpdate(el.style);
				update(an.interpolation.from);
				controlAnimations.tween({
					id: `${an.id}-${index}`,
					interpolation: { ...an.interpolation, delay: index * stagger },
					update,
				});
			});
		}
	}

	return Container(anim);
}

const Container = (anim) => html`
	<div class="tiny-effect-inner-text-under">
		<span id=${anim.old.id} class="old-text" style=${anim.old.style}>
			${anim.old.content}
		</span>
	</div>
	<div class="tiny-effect-inner-text-over">
		<span
			id=${anim.current.id}
			class="current-text"
			style=${anim.current.style}
		>
			${anim.current.content}
		</span>
	</div>
`;

function renderUpdate(styler) {
	return function (rendered) {
		const { style, transform } = extractTransform(rendered);
		styler({
			...style,
			...withTransform(transform, 1),
		});
	};
}

function getTextStatus(text, old) {
	const isText = !isNull(text);
	const isOldText = !isNull(old);
	const res = [
		isText && !isOldText && 'enter',
		isText && isOldText && 'update',
		!isText && isOldText && 'leave',
	]
		.filter(Boolean)
		.pop();
	return res;
}

const List = (list) =>
	list.map(
		({ char, style }) =>
			html`<div class="tiny-effects-list-item" style=${style}>${char}</div>`
	);
