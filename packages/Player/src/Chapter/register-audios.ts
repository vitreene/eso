import { Scene as SceneProps } from '../../../types/Entries-types';

export type AudioClips = Map<string, MediaElementAudioSourceNode>;

export function registerAudio(audioContext) {
	return async function _registerAudio(
		scene: SceneProps
	): Promise<{ id: string; audioClips: AudioClips }> {
		const audioClips: AudioClips = new Map();

		return new Promise((resolve, reject) => {
			scene.stories.forEach(({ persos }) => {
				const sounds = persos.filter((perso) => perso.nature === 'sound');
				Promise.all(
					sounds.map(async (perso) => {
						const src = perso.src || (perso.initial?.content as string);
						const audio = await getAudio(src, audioContext);
						audio.mediaElement.play();
						audioClips.set(perso.id, audio);

						return perso.id;
					})
				)
					.then(() => resolve({ id: scene.id, audioClips }))
					.catch((error) => {
						console.log('l‘audio ne s‘est pas correctement chargé ', error);
						return reject({ error, audioClips });
					});
			});
		});
	};
}

async function getAudio(
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
