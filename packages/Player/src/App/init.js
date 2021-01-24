import EventEmitter2 from 'eventemitter2';
import { createEso } from 'veso';

export const emitter = new EventEmitter2({ wildcard: true, maxListeners: 0 });
export const Eso = createEso(emitter);
