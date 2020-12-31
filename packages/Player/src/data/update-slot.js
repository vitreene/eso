import { storeNodes } from 'veso';
import { persos } from './store-persos';
import { storeSlots } from './store-slots';

// ============================================================

export function updateSlot(slotId, persosIds) {
	const content = persosIds.map((id) => storeNodes.get(persos.get(id).uuid));
	storeSlots.get(slotId)(content);
}
