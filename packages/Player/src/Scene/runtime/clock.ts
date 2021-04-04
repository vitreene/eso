import { TimeLiner, TimelineKey } from './timeline';

import { controlAnimations } from 'veso';
// import { emitter } from '../../App/init';

import { TC, PLAY, PAUSE, REWIND } from '../../data/constantes';
import { EventEmitter2 } from 'eventemitter2';
import { ESO_Channel } from '../../../../types/ESO_enum';

export type Clock = {
	start(): void;
	chrono(): number;
};

//////// CLOCK /////////////////////////
// TODO use performance.now()
export function clock(timeLiner: TimeLiner, emitter: EventEmitter2): Clock {
	const beat = 10; // tout les 1/100e de seconde
	const startTime: number = Date.now();
	const maxCount: number = 100000 + 1;

	let tick: number = beat;
	let count = 0;
	let elapsed = 0;
	let secondes = 0;
	let timeout: any;

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

	// emitter.emit('*.init', { chrono: 0 });

	const timeLine = timeLiner.timeLine;
	const eventDatas = timeLiner.eventDatas;

	const emitEvent = (count: number) => (tm: TimelineKey) => (
		channel: ESO_Channel
	) => {
		if (tm[channel][count]) {
			const _emitEvent = (name: string) => {
				const data: any = ((eventDatas[channel] || {})[count] || {})[name];
				console.log('|-->', channel, name, data ? data : '');
				emitter.emit([channel, name], { ...data, chrono: count });
			};
			tm[channel][count].forEach(_emitEvent);
		}
	};

	function loop(): void {
		if (isPlaying) {
			// tout les dixièmes de seconde
			if (count % 100 === 0) {
				const emitEventCount = emitEvent(count);
				for (const timeEvent of timeLine) {
					const emitEventCountTimeLine = emitEventCount(timeEvent.timeLine);
					Object.keys(timeEvent.timeLine).forEach(emitEventCountTimeLine);
				}

				secondes = count / 1000;
			}
			count % 1000 === 0 && emitter.emit('secondes', secondes);
			count = count + beat;
		}
		emitter.emit('elapsed', elapsed);
		elapsed = elapsed + beat;
		tick = startTime + count - Date.now();
		count < maxCount && (timeout = setTimeout(loop, tick));
	}

	//  séparer le lancement de la boucle de emit init;
	// setTimeout(loop, 0);

	return {
		start() {
			console.log('timeLine', timeLine);
			console.log('eventDatas', eventDatas);
			loop.bind(this)();
		},
		chrono() {
			return Math.round(count / 100) * 100 + 100;
		},
	}; // next tick
}
