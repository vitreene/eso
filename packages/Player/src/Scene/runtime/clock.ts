import { Audio2D } from 'audio2d';
import MuskOx from 'musk-ox';

import { TimeLiner, TimelineKey } from './timeline';

import { controlAnimations } from 'veso';

import { TC, PLAY, PAUSE, REWIND } from '../../data/constantes';
import { EventEmitter2 } from 'eventemitter2';
import { ESO_Channel } from '../../../../types/ESO_enum';

export type Clock = {
	start(): void;
	chrono(): number;
};

// init au niveau du projet
const AC = new AudioContext();

//////// CLOCK /////////////////////////
export function clock(timeLiner: TimeLiner, emitter: EventEmitter2): Clock {
	let isPlaying = true;

	/// a retirer d'ici
	emitter.on([TC, PLAY], () => {
		isPlaying = true;
		controlAnimations.play();
	});
	emitter.on([TC, PAUSE], () => {
		isPlaying = false;
		controlAnimations.pause();
	});
	// emitter.on([TC, REWIND], () => {
	// 	count = 0;
	// 	secondes = 0;
	// 	controlAnimations.reset();
	// 	clearTimeout(timeout);
	// 	loop();
	// });
	////

	let count = 0;
	let pause = 0;

	let elapsed = 0;
	let raf: number;
	const maxTime = 20_000;

	const times = timeLiner.times;
	const timeLine = timeLiner.timeLine;
	const eventDatas = timeLiner.eventDatas;

	const emitEvent = (count: number) => (tm: TimelineKey) => (
		channel: ESO_Channel
	) => {
		if (tm[channel][count]) {
			const _emitEvent = (name: string) => {
				const data: any = eventDatas[channel]?.[count]?.[name];
				console.log('|-->', channel, name, data ? data : '');
				emitter.emit([channel, name], { ...data, chrono: count });
			};
			tm[channel][count].forEach(_emitEvent);
		}
	};

	function setLoop(_start: number) {
		const start = AC.currentTime - _start;
		function loop() {
			const time = Math.round((AC.currentTime - start) * 10) * 100;
			pause = isPlaying ? pause : time - count;
			const currentTime = time - pause;

			if (currentTime !== count) {
				count = currentTime;
				setTimeout(() => {
					while (times.length && times[0] <= count) {
						const emitEventCount = emitEvent(times[0]);
						for (const timeEvent of timeLine) {
							const emitEventCountTimeLine = emitEventCount(timeEvent.timeLine);
							Object.keys(timeEvent.timeLine).forEach(emitEventCountTimeLine);
						}
						times.shift();
					}

					if (count >= maxTime || !times.length)
						return cancelAnimationFrame(raf);
				});
			}

			const _elapsed = Math.round((AC.currentTime - start) * 10) * 100;
			if (_elapsed !== elapsed) {
				elapsed = _elapsed;
				elapsed % 100 === 0 && emitter.emit('secondes', elapsed / 100);
				emitter.emit('elapsed', elapsed);
			}
			raf = requestAnimationFrame(loop);
		}
		loop();
	}
	return {
		start() {
			console.log('timeLineR', timeLiner);
			console.log('timeLine', timeLine[0].timeLine);
			console.log('eventDatas', eventDatas);
			// initSound(setLoop);
			setLoop(0);
		},
		chrono() {
			return Math.round(count / 100) * 100 + 100;
		},
	}; // next tick
}

let sound;
function initSound(callback) {
	const a2d = new Audio2D();
	const muskox = new MuskOx();

	sound && sound.stop();
	a2d.removeAllAudio();
	const loaded = () => {
		const levelUpBuffer = muskox.fetch.audioBuffer('my-sound');
		sound = a2d.addAudio('my-sound', levelUpBuffer);
		console.log('LOADED');
		sound.play();
		callback(sound.currentTime);
	};
	muskox.onComplete.add(loaded);
	muskox.audioBuffer('my-sound', './sounds/microphone-countdown-341.mp3');
	muskox.start();
	return sound;
}
