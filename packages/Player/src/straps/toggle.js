import { DEFAULT_NS } from '../data/constantes';
// TODO register toggle
// exemple button

export default function addEventList(emitter) {
	const toggles = {};
	return function (data) {
		const { id, channel = DEFAULT_NS, valueA, valueB, ...others } = data;

		const channels = Array.isArray(channel) ? channel : [channel];
		toggles[id] || (toggles[id] = valueB);
		toggles[id] === valueB ? (toggles[id] = valueA) : (toggles[id] = valueB);
		channels.forEach((_channel) =>
			emitter.emit([_channel, toggles[id]], others)
		);
	};
}
