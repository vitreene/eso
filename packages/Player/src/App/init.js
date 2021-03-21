import EventEmitter2 from 'eventemitter2';
import { createEso } from 'veso';

export const emitter = new EventEmitter2({
	maxListeners: 0,
	/* 	delimiter: '.', */
});
export const Eso = createEso(emitter);
