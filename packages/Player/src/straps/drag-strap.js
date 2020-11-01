import { DEFAULT_NS, STRAP } from '../data/constantes';

const defaultCallback = () => console.log('callback');

export default function dragStrap(emitter) {
	return class Drag {
		constructor({ targets, allTargets, cb, ...data }) {
			// console.log('constructor DRAG', data);
			// console.log('TARGETS --->', targets);

			this.targets = Object.keys(targets);
			this.targetsActions = targets;
			this.allTargets = allTargets;

			this.cb = cb || defaultCallback;
			this.startDrag(data);
		}

		startDrag(d) {
			// console.log('startDrag', d);

			const actions = this.targetsActions._start(d);
			toArray(actions).forEach(({ event, data }) => emitter.emit(event, data));

			emitter.emit([STRAP, 'move'], d);
			emitter.once([STRAP, 'end_' + d.event], this.endDrag);
			emitter.on([STRAP, 'drag_guard_hover'], this._guard_hover);
		}

		endDrag = (d) => {
			// console.log('END DRAG', d);
			// console.log('d.target', d.target);

			emitter.off([STRAP, 'drag_guard_hover'], this._guard_hover);

			const hit = this.targets.includes(d.target);
			const actions = hit
				? this.targetsActions[d.target](d)
				: this.targetsActions.default(d);
			toArray(actions).forEach(({ event, data }) => emitter.emit(event, data));

			this.cb();
		};

		_guard_hover = ({ leave, hover }) => {
			// console.log('this.allTargets', this.allTargets);
			// console.log('{ leave, hover }', { leave, hover });
			this.allTargets.includes(leave) &&
				emitter.emit([DEFAULT_NS, 'leave_' + leave]);
			this.allTargets.includes(hover) &&
				emitter.emit([DEFAULT_NS, 'hover_' + hover]);
		};
	};
}

function toArray(el) {
	return Array.isArray(el) ? el : [el];
}
