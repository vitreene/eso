import { o } from 'sinuous';
import { storeSlots } from '../data/store-slots';

export function Slot({ uuid }) {
	// console.log('SLOT', uuid);
	!storeSlots.has(uuid) && storeSlots.set(uuid, o());
	return storeSlots.get(uuid);
}
