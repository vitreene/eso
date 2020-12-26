/* 
les evenTimes sont une collection de tableaux
par défaut le tableau des events statiques,
puis tout event dynamique ajouté, désigné par son id

- un eventList ajouté et transformé en timeline
- events dynamiques : des options permettent de soavoir comment les gérer :
    - once : les events restant sont effacés si l'eventlist est redemandée
    - temp : l'eventList est effacée entièrement après avoir ete jouée n fois.
    - ignore : n'intervient pas dans l'historique 
    - ... 
- evenTimes : la collection de evenTimes
- addEventList(event, time) ajoute une liste dynamique)
- seek(time) : rend la collection partielle des events jusq'à ce temps 
(n'est ce pas plutot géré par clock ?)

eventDatas collecte les données additionnelles à un event enregistré
*/

/* 
this.timeLine :  { id, timeline}[]
id: string
timeline: { time: [name]} : number:string[]
eventDatas[channel][count][name]
*/
import { ESO_Channel } from '../../../types/ESO_enum';
import { Eventime } from '../../../types/eventime';
import { DEFAULT_NS, MAIN } from '../data/constantes';

export type TimeLine = {
	level: string;
	timeLine: TimelineKey;
};

export type TimelineKey = {
	[key in ESO_Channel]?: { [key: number]: string[] };
};

type EventDatas = {
	[key in ESO_Channel]?:
		| {
				[key: number]: [{ [key: string]: string[] | undefined }];
		  }
		| {};
};

type MapEvents = {
	[key in ESO_Channel]?: { [key: string]: number[] };
};

type Options = {
	level: string;
	chrono?: number;
	once?: boolean;
	unique?: boolean;
};

const DEFAULT_LEVEL = 'static';

export class TimeLiner {
	public evenTimes: Eventime;
	public eventDatas: EventDatas = {};
	public timeLine: TimeLine[] = [];
	private solved: MapEvents = {};
	private remains: Eventime[] = [];
	private held: boolean = false;

	public constructor(evenTimes: Eventime, level: string = DEFAULT_LEVEL) {
		this.evenTimes = evenTimes;
		this.addEventList(evenTimes, { level });
	}

	public addEventList(
		evenTimes: Eventime,
		{ level, chrono = 0, once = false, unique = false }: Options
	) {
		this.eventDatas = this._mapEventDatas(evenTimes);
		const mapEvents = this._mapEvents(evenTimes, chrono);
		const timeLine = this._mapTimeEvents(mapEvents);

		// ajouter aux autres timelines
		const index = this.timeLine.findIndex((t) => t.level === level);
		if (index === -1) {
			this.timeLine.push({ level, timeLine });
		} else {
			if (once) {
				const newTl = this._once(timeLine, chrono, index);
				this.timeLine[index] = { level, timeLine: newTl };
			} else if (unique) {
				this.timeLine[index] = { level, timeLine };
				//TODO effacer l'eventList lorsque tous les event ont été executés
			} else
				this.timeLine[index] = {
					level,
					timeLine: { ...this.timeLine[index].timeLine, ...timeLine },
				};
		}
		console.log('this.timeLine', this.timeLine);
		console.log('timeLine---))', timeLine);
		console.log('this.evenTimes', this.evenTimes);
		console.log('mapEvents', mapEvents);
	}

	private _mapEvents(evenTimes: Eventime | Eventime[], chrono: number = 0) {
		this.remains = [];
		this.solved = {};
		this.held = false;
		let list: Eventime[] = Array.isArray(evenTimes) ? evenTimes : [evenTimes];

		while (!this.held) {
			this.held = true;
			this._tree(list, chrono);
			list = this.remains;
			this.remains = [];
		}
		return this.solved;
	}

	private _tree(list: Eventime[], chrono: number) {
		for (const event of list) {
			const channel = event.channel || DEFAULT_NS;
			!this.solved[channel] && (this.solved[channel] = {});

			let startAt = null;
			if (typeof event.startAt === 'number') startAt = event.startAt;
			else if (this.solved[channel][event.startAt])
				startAt = this.solved[channel][event.startAt][0];
			// else if (event.type === 'action') startAt = 0;

			if (startAt !== null) {
				this.held = false;
				const absTime = parseInt(startAt + chrono);
				this.solved[channel][event.name]
					? this.solved[channel][event.name].push(absTime)
					: (this.solved[channel][event.name] = [absTime]);
				event.events && this._tree(event.events, absTime);
			} else this._addEvent(event);
		}
	}

	private _mapEventDatas(evenTimes: Eventime, eventDatas: EventDatas = {}) {
		for (const event of evenTimes.events) {
			if (event.data) {
				const startAt = (evenTimes.startAt || 0) + (event.startAt || 0);
				const channel = event.channel || DEFAULT_NS;
				!eventDatas[channel] && (eventDatas[channel] = {});
				!eventDatas[channel][startAt] && (eventDatas[channel][startAt] = {});
				eventDatas[channel][startAt][event.name] = event.data;
			}
			if (event.events) this._mapEventDatas(event, eventDatas);
		}
		return eventDatas;
	}

	private _mapTimeEvents(mapEvents: MapEvents) {
		const evenTimes: TimelineKey = {};

		for (const channel in mapEvents) {
			for (const event in mapEvents[channel]) {
				!evenTimes[channel] && (evenTimes[channel] = {});
				mapEvents[channel][event].forEach((time) => {
					evenTimes[channel][time]
						? evenTimes[channel][time].push(event)
						: (evenTimes[channel][time] = [event]);
				});
			}
		}
		return evenTimes;
	}

	private _once(newTl: TimelineKey, chrono: number, index: number) {
		const timeLine = this.timeLine[index].timeLine;
		let tl: TimelineKey = {};
		for (const time in timeLine) {
			if (parseInt(time) < chrono) tl[time] = timeLine[time];
		}
		return { ...tl, ...newTl };
	}

	private _addEvent(event: Eventime) {
		if (this._found(event) === -1) this.remains.push(event);
	}

	private _found(event: Eventime) {
		return this.remains.findIndex((e) => e.name === event.name);
	}

	private _removeEvent(event: Eventime) {
		const _found = this._found(event);
		_found && this.remains.splice(_found, 1);
	}

	private _findEventList(name: string) {
		const eventList = this.evenTimes.events.find((e) => e.name === name);
		return eventList;
	}
}
