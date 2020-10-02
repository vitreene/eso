import { o, api, html } from "sinuous";
const { h } = api;

export const storeSlots = new Map();
export function Slot({ uuid }) {
	storeSlots.set(uuid, o());
	return (
		<>
			<div id={uuid}>{storeSlots.get(uuid)}</div>
		</>
	);
}
