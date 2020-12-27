// a recoller avec contantes.js

// remplacer par ESO_Channel
export enum ESO_EventName {
	PLAY = 'play',
	PAUSE = 'pause',
	STOP = 'stop',
	REWIND = 'rewind',
	TEMPO = 'tempo',
	TOGGLE = 'toggle',
}
export enum ESO_Channel {
	MAIN = 'anim',
	TELCO = 'telco',
	PLAY = 'play',
	STRAP = 'strap',
	DEFAULT_NS = MAIN,
	CONTAINER_ESO = 'main', // n'est pas un channel !
}

export enum ESO_Lang {
	FR = 'fr',
	EN = 'en',
	DE = 'de',
	ES = 'es',
	NL = 'nl',
	IT = 'it',
	PL = 'pl',
	PT = 'pt',
	RU = 'ru',
	CN = 'cn',
}

export enum Nature {
	IMG = 'img',
	SPRITE = 'sprite',
	BLOC = 'bloc',
	LAYER = 'layer',
	BUTTON = 'button',
	ROOT = 'root',
	POLYGON = 'polygon',
	SOUND = 'sound',
	VIDEO = 'video',
	PROTO = 'proto',
}
