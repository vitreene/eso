import { defaultBox } from '../zoom';
import { joinId } from '../shared/utils';

import { DEFAULT_NS, STRAP } from '../data/constantes';
import { SceneCast } from '../../../types/Entries-types';
import { EventEmitter2 } from 'eventemitter2';
/* 
- pointeur lit la position de la souris / touch
-> emet : 
- position
- decalage depuis le debut, 
- decalage depuis la precedente mesure
- move/id : lit l'id et le decalage, envoie un event ciblé.: 
-  il peut emetre deux events à la fois : le complet et le ciblé.

TODO 
- observables.fromEvent
- touch events
- des parametres sont envoyés à pointeur qui filtre ce qu'il veut recevoir. 
*/

/* 
FIXME : au mousedown, la position verticale du pointer est mal calculée, ce qui entraine un décalage en débutt de déplacement. 
cependant, en modifiant la css de #app, puis en la rétablissant, le déplacmeent est ensuite correct...
*/

interface MoveData {
	id: string;
	event: string;
	reactions?: any;
	e: MouseEvent;
}

export function moveStrap(emitter: EventEmitter2, cast: () => SceneCast) {
	return class Move {
		zoom: number;
		data: MoveData;
		below: string;
		reactions: any;
		pointerEvents: string;
		isStatic: boolean;

		initialElPosition = {
			x: 0,
			y: 0,
		};
		initialMousePosition = {
			x: 0,
			y: 0,
		};
		pointer = {
			x: 0,
			y: 0,
		};

		constructor(data: MoveData) {
			console.log('DATA', data);
			const box = findBoxInCast(data.id, cast());
			this.zoom = box.zoom;
			this.data = data;
			this.below = null;

			console.log(this.zoom);

			// passe un nom plutot que la fonction complete ?
			this.reactions = data?.reactions;
			const cssprops = window.getComputedStyle(data.e.target as Element);
			this.pointerEvents = cssprops.getPropertyValue('pointer-events');
			this.isStatic = cssprops.getPropertyValue('position') === 'static';

			emitter.once([STRAP, 'move-cancel'], this.cancel);
			this.down();
		}

		cancel() {
			console.log('cancel move');
			document.dispatchEvent(new PointerEvent('pointerup'));
		}
		move = (e: MouseEvent) => {
			const { id, event } = this.data;

			// sous le pointer
			const below = document.elementFromPoint(e.clientX, e.clientY);
			const belowChanged = below && below.id !== this.below;
			const absPointer = {
				x: window.scrollX + e.clientX,
				y: window.scrollY + e.clientY,
			};

			const newPointer = {
				x: absPointer.x - this.initialMousePosition.x,
				y: absPointer.y - this.initialMousePosition.y,
			};
			const z = this.zoom;
			const relativePointer = {
				x: newPointer.x / z,
				y: newPointer.y / z,
			};

			// diffuser l'event
			if (belowChanged) {
				const hover = this.reactions?.hover;
				hover &&
					emitter.emit([STRAP, hover], {
						leave: this.below,
						hover: below.id,
						id,
						event,
					});

				this.below = below.id;
			}

			emitter.emit([DEFAULT_NS, event], {
				style: {
					dX: relativePointer.x,
					dY: relativePointer.y,
				},
			});
			emitter.emit([STRAP, 'pointer'], {
				relativeFromStart: newPointer,
				relativeFromLast: relativePointer,
				pointerFromStart: this.pointer,
				pointeur: absPointer,
			});

			this.pointer = newPointer;
		};

		up = (e: MouseEvent) => {
			e.preventDefault();

			const { id, event } = this.data;

			document.removeEventListener('pointermove', this.move);
			document.removeEventListener('pointerup', this.up);

			// top, left sur le composant, x,y pour le support
			const sign = {
				x: this.pointer.x < 0 ? '-' : '+',
				y: this.pointer.y < 0 ? '-' : '+',
			};
			const z = this.zoom;
			const style = {
				pointerEvents: this.pointerEvents,
				left: `${sign.x}=${Math.abs(this.pointer.x / z)}`,
				top: `${sign.y}=${Math.abs(this.pointer.y / z)}`,
				dX: 0,
				dY: 0,
			};

			const absPointer = {
				x: window.scrollX + e.clientX,
				y: window.scrollY + e.clientY,
			};

			emitter.emit([DEFAULT_NS, event], { style });

			emitter.emit([STRAP, joinId('end', event)], {
				id,
				event,
				style,
				pointer: absPointer,
				target: this.below,
				initialElPosition: this.initialElPosition,
			});
		};

		down = () => {
			const { id, event, e } = this.data;
			e.preventDefault();

			console.log('POINTERDOWN', id, event);

			document.addEventListener('pointermove', this.move);
			document.addEventListener('pointerup', this.up);

			// faut-il cibler la story à l'origine de l'appel ?
			emitter.emit([DEFAULT_NS, event], {
				style: {
					...(this.isStatic && { position: 'relative' }),
					pointerEvents: 'none',
				},
			});

			this.initialMousePosition = {
				x: e.clientX,
				y: e.clientY,
			};

			this.pointer = {
				x: 0,
				y: 0,
			};
		};
	};
}

function findBoxInCast(id: string, cast: SceneCast) {
	console.log(id, cast);

	let result = defaultBox;
	for (const story in cast) {
		const found = cast[story].persos.has(id);
		if (found) {
			result = cast[story].zoom.box;
			break;
		} else {
			console.warn(story, found);
		}
	}
	return result;
}
