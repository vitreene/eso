import { reslot } from './reslot';
import { doTransition } from './transitions-component';

export function createTransition(emitter) {
	return function transitions(props) {
		/* 
		const move = reslot(props);
		const t = props.update.transition;
		if (!move && !t) return;
    
		const transition = [
      ...(Array.isArray(t) ? t : [t]),
			...(move && [...move]),
		].filter(Boolean);
    */
		const transition = reslot(props);
		props.perso.id === 'text-sample' && console.log('transition', transition);
		transition && doTransition(props.perso, transition, emitter);
	};
}
