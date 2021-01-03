// TODO raz toggles

export default function toggleStrap(emitter) {
	const toggles = {};
	function emit(name, others) {
		return function _emit(_channel) {
			emitter.emit([_channel, name], others);
		};
	}
	return function toggle({ id, event, ...others }) {
		const { channel, name } = event;
		if (!toggles[id]) {
			toggles[id] = {
				value: 0,
				channel: Array.isArray(channel) ? channel : [channel],
				name: Array.isArray(name) ? name : [name],
				index: 0,
			};
		}

		toggles[id].index = (toggles[id].index + 1) % toggles[id].name.length;
		toggles[id].value = toggles[id].name[toggles[id].index];

		toggles[id].channel.forEach(emit(toggles[id].value, others));
	};
}
