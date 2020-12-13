import { EsoInitial, Style } from '../../../types/initial';
import { setClassNames } from 'veso';

export function deepmerge(proto, ref) {
	const initial = merge.initial(proto.initial, ref.initial);
	return { ...ref, initial };
}
export const merge = {
	style(proto: Style, ref: Style) {
		const style = Object.assign({}, proto, ref);
		return Object.keys(style).length ? style : null;
	},
	className(proto: string | [string], ref: string | [string]) {
		console.log('className', proto, ref);

		const className = setClassNames(ref, proto).join(' ');
		return className ? className : null;
	},
	initial(proto: EsoInitial, ref: EsoInitial) {
		const className = this.className(proto.className, ref.className);
		const statStyle = this.style(proto.statStyle, ref.statStyle);
		const dynStyle = this.style(proto.dynStyle, ref.dynStyle);
		return Object.assign(
			{},
			proto,
			ref,
			className && { className },
			statStyle && { statStyle },
			dynStyle && { dynStyle }
		);
	},
};
