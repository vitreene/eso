// import { DEFAULT_NS } from '../data/constantes';

// TODO raz toggles
// export default function toggleStrap(emitter) {
// 	const toggles = {};
// 	return function toggle(data) {
// 		const { id, channel = DEFAULT_NS, valueA, valueB, ...others } = data;

// 		const channels = Array.isArray(channel) ? channel : [channel];
// 		toggles[id] || (toggles[id] = valueB);
// 		toggles[id] === valueB ? (toggles[id] = valueA) : (toggles[id] = valueB);
// 		channels.forEach((_channel) =>
// 			emitter.emit([_channel, toggles[id]], others)
// 		);
// 	};
// }

export default function toggleStrap(emitter) {
	const toggles = {};
	function emit(name, others) {
		return function _emit(_channel) {
			emitter.emit([_channel, name], others);
		};
	}
	return function toggle({ id, event, ...others }) {
		console.log('listeners', emitter.listeners('strap.toggle'));

		const { channel, name } = event;
		if (!toggles[id]) {
			toggles[id] = {
				value: 0,
				channel: Array.isArray(channel) ? channel : [channel],
				name: Array.isArray(name) ? name : [name],
				index: 0,
			};
		}

		console.log(
			toggles[id].index + 1,
			toggles[id].name.length - 1,
			(toggles[id].index + 1) % toggles[id].name.length
		);
		toggles[id].index = (toggles[id].index + 1) % toggles[id].name.length;
		toggles[id].value = toggles[id].name[toggles[id].index];

		console.log('toggles[id]', id, toggles[id]);
		toggles[id].channel.forEach(emit(toggles[id].value, others));
	};
}
