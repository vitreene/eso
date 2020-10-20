import EventEmitter2 from 'eventemitter2';
export const emitter = new EventEmitter2({ wildcard: true, maxListeners: 0 });
