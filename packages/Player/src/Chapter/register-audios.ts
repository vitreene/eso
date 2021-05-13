import { Scene as SceneProps } from '../../../types/Entries-types';

export type AudioClip = {
	audio: MediaElementAudioSourceNode;
	playing: boolean;
};

export type AudioClips = Map<string, AudioClip>;

export function registerAudio(audioContext) {
	return async function _registerAudio(
		scene: SceneProps
	): Promise<{ id: string; audioClips: AudioClips }> {
		const audioClips: AudioClips = new Map();

		return new Promise((resolve, reject) => {
			const sounds = scene.stories
				.flatMap(({ persos }) => persos)
				.filter((perso) => perso.nature === 'sound');
			Promise.all(
				sounds.map(async (perso) => {
					const src = perso.src || (perso.initial?.content as string);
					const audio = await loadAudio(src, audioContext);
					audioClips.set(perso.id, { audio, playing: false });
					console.log('audioClips', audioClips.get(perso.id));

					return perso.id;
				})
			)
				.then(() => resolve({ id: scene.id, audioClips }))
				.catch((error) => {
					console.log('l‘audio ne s‘est pas correctement chargé ', error);
					return reject({ error, audioClips });
				});
		});
	};
}

async function loadAudio(
	filepath: string,
	audioContext: AudioContext
): Promise<MediaElementAudioSourceNode> {
	return new Promise((resolve, reject) => {
		const source = new Audio();
		source.oncanplay = () => {
			const sampleSource = audioContext.createMediaElementSource(source);
			sampleSource.connect(audioContext.destination);
			resolve(sampleSource);
		};
		source.onerror = (err) => reject(err);
		source.src = filepath;
	});
}
