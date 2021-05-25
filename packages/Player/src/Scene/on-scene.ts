import { EsoAction } from '../../../types/initial';
import { TELCO } from '../data/constantes';

/** 
la fonction onScene gere le flux des objets.
- liste le contenu de chaque slot,
- pour chaque element, 
    - dans quel slot il se trouve,
    - son statut : entre (enter), sort (exit), deplacé
    - déplacement : 
        - retrait de l'emplacement (unmount),
        - ajout dans le nouvel emplacement (mount)
        
    ces événements sont transmis à l'objet lui-meme
*/

/**
    * Slots : collection des ids des slots: pour chaque slot, liste des persos
    * onScene: liste des persos visibles, dans leur slot
    * up, propiétés employées : 
        * layer et slot pour créer slotId
        * id du Perso
    * fonctions :
        * enter: ajouter un composant à onscene
        * move: deplacement d'un slot à un autre
        * reorder: changement de position dans un slot
        * leave : retrait de onScene (async)
   
    onScene renvoie :
    les ids des slots à upr
    l'objet up augmenté
        - reslot
        - enter
        - leave (callback)

    onScene précede la phase d'up du composant lui-meme
    
*/

/* 
simplifier leave :
- le Perso recoit le flag "exit"
- en fin de transition, il emet un event "leave" 
- le composant est retiré de la scène.
*/
export interface Update extends Partial<EsoAction> {
	sound?: boolean;
	action: string;
	chrono: number;
	channel: string;
	entry?: boolean;
}
export interface Status {
	changed: { status: string };
	update: Update;
	seek?: boolean;
}

export class OnScene {
	areOnScene = new Map();
	_slots = new Map();

	constructor() {
		this.update = this.update.bind(this);
		this.addSlots = this.addSlots.bind(this);
		this._enterScene = this._enterScene.bind(this);
		this._addToScene = this._addToScene.bind(this);
		this._moveToSlot = this._moveToSlot.bind(this);
		this._leaveScene = this._leaveScene.bind(this);
		this._exitScene = this._exitScene.bind(this);
	}
	/* 
  TODO un élément qui a quitté la scene ne peut revenir que par un autre "enter"
  ainsi, si un élément est supprimé, aucun autre évent ne peut le ramener s'il n'a pas de propriété "enter".
  - comment faire fonctionner ce procédé avec la timeline ?
  - y a il d'autres façons de faire ?
  - quels sont les cas ou c'est utile ?

	ATTENTION play et pause peuvent activer un élément; c'est neutralisé pour TELCO, mais  cela peut etre utilisé autrement et provoquer l'apparition d'un élément ?
 */
	addSlots(id: string) {
		this._slots.set(id, new Set());
	}
	update(up: Update): Status {
		if (!up.id) return this._getError('id', up);
		if (up.channel === TELCO) return this._update(up);

		let action = this._update;
		if (this.areOnScene.has(up.id)) {
			const isLeaving = up.leave;
			const { move } = up;
			const changeSlot = typeof move === 'object' ? move.slot : move;

			changeSlot && (action = this._moveToSlot);
			isLeaving && (action = this._leaveScene);
		} else action = this._enterScene;
		return action(up);
	}

	_update(update: Update) {
		return { changed: { status: 'update' }, update };
	}

	_enterScene(up: Update) {
		if (up.move) return this._addToScene(up);
		if (up.sound) return this._soundToScene(up);
		console.warn('_addToScene fail', up);
		return { changed: { status: 'fail' }, update: null };
	}

	_soundToScene(up: Update) {
		this.areOnScene.set(up.id, 'sound');
		return {
			changed: { status: 'enter' },
			update: { ...up, enter: true },
		};
	}

	_addToScene(up) {
		const { move } = up;
		const slotId = move.slot;
		if (!slotId || !this._slots.has(slotId)) return this._getError('slot', up);

		// TODO trier selon l'ordre
		const inslot = new Set(this._slots.get(slotId));
		inslot.add(up.id);

		this._slots.set(slotId, inslot);
		this.areOnScene.set(up.id, slotId);
		return {
			changed: { status: 'enter', add: [slotId, inslot] },
			update: { ...up, enter: true },
		};
	}

	_moveToSlot(up: Update) {
		if (!up.move) {
			console.warn('_moveToSlot fail', up);
			return;
		}
		const { move } = up;

		const oldSlotId = this.areOnScene.get(up.id);
		const slotId = typeof move === 'object' ? move.slot : move;
		const oldInslot = new Set(this._slots.get(oldSlotId));
		oldInslot.delete(up.id);
		if (!this._slots.get(slotId)) return this._getError('move', up);

		const inslot = new Set(this._slots.get(slotId));
		inslot.add(up.id);
		this._slots.set(oldSlotId, oldInslot);
		this._slots.set(slotId, inslot);
		this.areOnScene.set(up.id, slotId);

		return {
			changed: {
				status: 'move',
				remove: [oldSlotId, oldInslot],
				add: [slotId, inslot],
			},
			update: { ...up, reslot: true },
		};
	}

	_leaveScene(up) {
		if (up.sound) return this._exitSound(up);
		return this._exitScene(up);
	}

	_exitSound(up) {
		return {
			changed: { status: 'leave' },
			update: up,
		};
	}

	_exitScene(up) {
		const { id } = up;
		const slotId = this.areOnScene.get(id);
		if (!this._slots.has(slotId)) {
			console.warn('slot %s introuvable dans %s', slotId, id);
			return this._getError('_leaveScene', up);
		}
		const inslot = new Set(this._slots.get(slotId));
		inslot.delete(id);
		this._slots.set(slotId, inslot);
		this.areOnScene.delete(id);
		return {
			changed: { status: 'leave', remove: [slotId, inslot] },
			update: up,
		};
	}

	_getError = (errorId, up) => ({
		areOnScene: this.areOnScene,
		slots: this._slots,
		changed: errors[errorId],
		update: up,
	});
}

const errors = {
	_leaveScene: 'error _leaveScene : slot introuvable',
	move: 'error move: not a valid slot',
	slot: 'error: not a valid slot',
	id: 'error: not a valid id',
};
