import { clock } from '../runtime/clock';
import { emitter } from '../runtime/emitter';
import { registerStraps } from '../register/register-straps';

export let chrono;

export const initClock = (timeLiner) => {
  chrono = clock(timeLiner, emitter);
  registerStraps(chrono, timeLiner, emitter);
};
