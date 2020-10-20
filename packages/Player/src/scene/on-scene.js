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
    * Slots : collection des ids des slots: pour chaque slot, liste des valets
    * onScene: liste des valets visibles, dans leur slot
    * up, propiétés employées : 
        * layer et slot pour créer slotId
        * id du Valet
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
- le Valet recoit le flag "exit"
- en fin de transition, il emet un event "leave" 
- le composant est retiré de la scène.
*/

/* 
- reslot est géré à part, avant up
- il faut pouvoir ensuite lire sa nouvelle position , puis le mettre a jour avant rafraichissement de l'écran
    // reslot : position du node avant et après déplacement
    // créer une transition
    // le tout avant réaffichage
*/

export class OnScene {
  constructor(slots) {
    // if (!slots || typeof slots !== "object") return false;
    if (!slots || !(slots instanceof Map)) return false;
    this._slots = new Map(Array.from(slots.keys(), (id) => [id, []]));
    this.areOnScene = new Map();

    this.update = this.update.bind(this);
    this._addToScene = this._addToScene.bind(this);
    this._moveToSlot = this._moveToSlot.bind(this);
    this._leaveScene = this._leaveScene.bind(this);
  }
  /* 
  TODO un élément qui a quitté la scene ne peut revenir que par un autre "enter"
  ainsi, si un élément est supprimé, aucun autre évent ne peut le ramener s'il n'a pas de propriété "enter".
  - comment faire fonctionner ce procédé avec la timeline ?
  - y a il d'autres façons de faire ?
  - quels sont les cas ou c'est utile ?
 */

  update(up) {
    let action = (update) => ({ changed: null, update });
    if (!up.id) return this._getError("id", up);
    if (this.areOnScene.has(up.id)) {
      const isLeaving = up.leave;
      const { move } = up;
      const changeSlot = move && move.layer && move.slot;

      changeSlot && (action = this._moveToSlot);
      isLeaving && (action = this._leaveScene);
    } else action = this._addToScene;

    return action(up);
  }

  _addToScene(up) {
    if (!up.move) {
      console.warn("_addToScene fail");
      return;
    }
    const { move } = up;
    const slotId = move.slot;

    if (!slotId || !this._slots.has(slotId)) return this._getError("slot", up);

    // TODO trier selon l'ordre
    const inslot = this._slots.get(slotId).concat(up.id);
    this._slots.set(slotId, inslot);
    this.areOnScene.set(up.id, slotId);
    const changed = { add: [slotId, inslot] };
    return {
      changed,
      update: { ...up, enter: true },
    };
  }

  _moveToSlot(up) {
    if (!up.move) {
      console.warn("_moveToSlot fail");
      return;
    }
    const { move } = up;

    const oldSlotId = this.areOnScene.get(up.id);
    const slotId = move.slot;

    const oldInslot = this._slots.get(oldSlotId).filter((s) => s !== up.id);
    if (!this._slots.get(slotId)) return this._getError("move", up);

    const inslot = this._slots.get(slotId).concat(up.id);
    this._slots.set(oldSlotId, oldInslot);
    this._slots.set(slotId, inslot);
    this.areOnScene.set(up.id, slotId);

    const changed = {
      remove: [oldSlotId, oldInslot],
      add: [slotId, inslot],
    };
    return {
      changed,
      update: { ...up, reslot: true },
    };
  }

  _leaveScene(up) {
    const { id } = up;
    const slotId = this.areOnScene.get(id);
    const inslot = this._slots.get(slotId).filter((s) => s !== id);
    this._slots.set(slotId, inslot);
    this.areOnScene.delete(id);
    const changed = { remove: [slotId, inslot] };
    return {
      changed,
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
  move: "error move: not a valid slot",
  slot: "error: not a valid slot",
  id: "error: not a valid id",
};
