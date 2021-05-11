import { AudioClip } from 'audio2d/lib/audio_clip';
import MuskOx from 'musk-ox';

const muskox: MuskOx = new MuskOx();

export type SoundClips = Map<string, AudioClip>;
export interface SceneSounds {
	id: string;
	soundClips: SoundClips;
}

/* 
Attention, ne lit que des morceaux courts avec audioBuffer. 
-> evoluer vers de l'audio simple
*/
export function registerAudio(audio) {
	return async function _registerAudio(scene) {
		const soundClips: SoundClips = new Map();
		const soundIds: Set<string> = new Set();
		return new Promise<SceneSounds>((resolve, reject) => {
			scene.stories.forEach(({ persos }) => {
				const sounds = persos.filter((perso) => perso.nature === 'sound');
				sounds.forEach((perso) => {
					const src = perso.src || perso.initial?.content;
					soundIds.add(perso.id);
					muskox.audioBuffer(perso.id, src);
				});
			});

			muskox.onComplete.add(() => {
				soundIds.forEach((id: string) => {
					const buffer = muskox.fetch.audioBuffer(id);
					console.log('registerAudio', id, buffer);
					soundClips.set(id, audio.addAudio(id, buffer));
				});
				console.log('muskox.onComplete');

				return resolve({ soundClips, id: scene.id });
			});

			muskox.onError.add((error: any) => {
				console.log('l‘audio ne s‘est pas correctement chargé ', error);
				return reject({ error, soundIds });
			});
			muskox.start();
		});
	};
}

type AudioClips = Map<string, AudioBufferSourceNode>;
export function QregisterAudio(audioContext) {
	return async function _registerAudio(scene) {
		const soundClips: AudioClips = new Map();

		return new Promise((resolve, reject) => {
			scene.stories.forEach(({ persos }) => {
				const sounds = persos.filter((perso) => perso.nature === 'sound');

				Promise.all(
					sounds.forEach(async (perso) => {
						const src = perso.src || perso.initial?.content;
						const audio = await getAudio(src, audioContext);

						soundClips.set(perso.id, audio);
					})
				)
					.then(() => resolve(soundClips))
					.catch((error: any) => {
						console.log('l‘audio ne s‘est pas correctement chargé ', error);
						return reject({ error, soundClips });
					});
			});
		});
	};
}

// function loadAudio(url, context, done) {
//   fetch(url)
//     .then(response => response.arrayBuffer())
//     .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
//     .then(audioBuffer => {
//       console.log('audio ' + url + ' loaded')
//       const sourceNode = context.createBufferSource()
//       sourceNode.buffer = audioBuffer
//       done(null, sourceNode)
//       sourceNode.start()

//     })
// }

async function getAudio(filepath: string, audioContext: AudioContext) {
	const response = await fetch(filepath);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
	const sampleSource = audioContext.createBufferSource();
	sampleSource.buffer = audioBuffer;
	sampleSource.connect(audioContext.destination);
	return sampleSource;
}

/* 
const load = () => {
  const request = new XMLHttpRequest();
  request.open("GET", "freejazz.wav");
  request.responseType = "arraybuffer";
  request.onload = function() {
    let undecodedAudio = request.response;
    audioCtx.decodeAudioData(undecodedAudio, (data) => buffer = data);
  };
  request.send();
}
Now, we can play the sound file by creating an AudioNode, attaching our buffer to it, connecting it to the dac, and playing it.

const play = () => {
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
};


*/
