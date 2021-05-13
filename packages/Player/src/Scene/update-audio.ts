import { AudioClip } from '../Chapter/register-audios';

export function updateAudio({ changed, update }, clip: AudioClip) {
	console.warn('j’ai trouve le son  %s', update.id, changed, update);

	/* 
si play vient de telco, vérifier si le son peut démarrer 
-> distinguer la pause générale de l'intention de lecture
*/

	switch (changed.status) {
		case 'enter':
			clip.audio.mediaElement.play();
			clip.playing = true;
			break;
		case 'leave':
			clip.audio.mediaElement.pause();
			clip.playing = false;
			break;
		case 'update':
			update.play && clip.playing && clip.audio.mediaElement.play();
			update.pause && clip.playing && clip.audio.mediaElement.pause();
		default:
			break;
	}
}
