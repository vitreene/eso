import { storeNodes } from 'veso';

import { scene } from './index';
console.log('scene', scene);
const storeSlots = scene.slots;
const persos = scene.persos;
// ============================================================

export function updateSlot(slotId, persosIds) {
	const content = persosIds.map((id) => storeNodes.get(persos.get(id).uuid));
	storeSlots.get(slotId)(content);
}
