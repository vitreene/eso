import { o } from 'sinuous';

export const storeSlots = new Map();

export function Slot({ uuid }) {
	// console.log('SLOT', uuid);
	!storeSlots.has(uuid) && storeSlots.set(uuid, o());
	return storeSlots.get(uuid);
}
