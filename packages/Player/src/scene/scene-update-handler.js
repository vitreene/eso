import { storeNodes } from 'veso';

import { zoom, getElementOffsetZoomed } from '../zoom';
import { DEFAULT_NS, DEFAULT_DURATION } from '../data/constantes';

// déclenche les updates
// ============================================================
export function sceneUpdateHandler(onScene, persos, slots) {
  return function handler(update) {
    // TODO factoriser tous les appels à raf dans une meme fonction
    requestAnimationFrame(() => {
      const up = onScene.update(update);
      updateScene(up);
    });
  };

  // ============================================================
  function updateScene({ changed, update }) {
    // console.log("update", update);
    if (!update || Object.keys(update).length === 0) return;
    if (typeof changed === 'string') {
      console.error(changed, update);
      return;
    }
    const rescale = update.move?.rescale;
    const perso = persos.get(update?.id);

    // zoom enter
    if (update.enter) perso.prerender(zoom.value);

    // RESLOT et RESCALE
    let old,
      current,
      transition = [];

    if (update.transition) {
      Array.isArray(update.transition)
        ? transition.push(...update.transition)
        : transition.push(update.transition);
    }

    if (changed?.remove) {
      if (perso) {
        const node = rescale ? perso.node().parentNode : perso.node();
        old = getElementOffsetZoomed(node, zoom.box.zoom);
      }
      updateSlot(...changed.remove);
    }

    if (changed?.add) {
      updateSlot(...changed.add);
      if (perso) {
        const node = rescale ? perso.node().parentNode : perso.node();
        current = getElementOffsetZoomed(node, zoom.box.zoom);
      }
    }

    console.log('perso, old, current', perso, old, current);

    if (old && current) {
      // en cas de resize, il faudrait recalculer la position des blocs, en gardant la valeur progress de l'interpolation
      const position = {
        dX: old.x - current.x,
        dY: old.y - current.y,
      };

      transition.push({
        from: position,
        to: { dX: 0, dY: 0 },
        duration: DEFAULT_DURATION,
      });

      // rescale
      if (rescale) {
        const oldDimensions = {
          width: old.width,
          height: old.height,
        };
        const currentDimensions = {
          width: current.width,
          height: current.height,
        };

        transition.push({
          from: oldDimensions,
          to: currentDimensions,
          duration: DEFAULT_DURATION,
          oncomplete: [
            {
              event: { ns: DEFAULT_NS, name: 'end-rescale-' + update?.id },
              data: {
                dynStyle: {
                  width: '100%',
                  height: '100%',
                },
              },
            },
          ],
        });
      }
    }

    persos.get(update.id).update({ ...update, transition });
  }

  // ============================================================
  function updateSlot(slotId, persosIds) {
    const content = persosIds.map((id) => storeNodes.get(persos.get(id).uuid));
    // console.log('updateSlot content', content);
    slots.get(slotId)(content);
  }
}
