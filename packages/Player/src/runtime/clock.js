import { controlAnimations } from 'veso';
import { TC, PLAY, PAUSE, REWIND } from '../data/constantes';

//////// CLOCK /////////////////////////
// TODO use performance.now()
export function clock(timeLiner, emitter) {
  const beat = 10; // tout les 1/100e de seconde
  const startTime = Date.now();
  const maxCount = 20000 + 1;

  let tick = beat;
  let count = 0;
  let elapsed = 0;
  let secondes = 0;
  let timeout;

  let isPlaying = true;
  emitter.on([TC, PLAY], () => {
    isPlaying = true;
    controlAnimations.play();
  });
  emitter.on([TC, PAUSE], () => {
    isPlaying = false;
    controlAnimations.pause();
  });
  emitter.on([TC, REWIND], () => {
    count = 0;
    secondes = 0;
    controlAnimations.reset();
    clearTimeout(timeout);
    loop();
  });

  emitter.emit('*.init', { chrono: 0 });

  const timeLine = timeLiner.timeLine;
  console.log('timeLine', timeLine);

  const emitEvent = (count) => (tm) => (NS) => {
    if (tm[NS][count]) {
      const _emitEvent = (name) =>
        console.log('name', name) ||
        emitter.emit([NS, name], { chrono: count });
      tm[NS][count].forEach(_emitEvent);
    }
  };

  function loop() {
    if (isPlaying) {
      // tout les diziemes de seconde
      if (count % 100 === 0) {
        const emitEventCount = emitEvent(count);
        for (const timeEvent of timeLine) {
          const emitEventCountTimeLine = emitEventCount(timeEvent.timeLine);
          Object.keys(timeEvent.timeLine).forEach(emitEventCountTimeLine);
        }

        secondes = count / 1000;
      }
      emitter.emit('secondes', secondes);
      count = count + beat;
    }
    emitter.emit('elapsed', elapsed);
    elapsed = elapsed + beat;
    tick = startTime + count - Date.now();
    count < maxCount && (timeout = setTimeout(loop, tick));
  }

  //  séparer le lancement de la boucle de emit init;
  setTimeout(loop, 0);

  return () => parseInt(count / 100) * 100 + 100; // next tick
}
