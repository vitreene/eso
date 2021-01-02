import { o } from 'sinuous';
// import { storeSlots } from '../Scene/store-slots';

import { scene } from '../Scene';
const storeSlots = scene.slots;

export function Slot(uuid) {
	// console.log('SLOT', uuid);
	!storeSlots.has(uuid) && storeSlots.set(uuid, o());
	return storeSlots.get(uuid);
}
