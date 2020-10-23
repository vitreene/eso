/* 
crrer une classe
les timeevents sont une collection de tableaux
par défaut le tableau des events statiques,
puis tout event dynamique ajouté, désigné par son id

- un eventList ajouté et transformé en timeline
- events dynamiques : des options permettent de soavoir comment les gérer :
    - once : les events restant sont effacés si l'eventlist est redemandée
    - temp : l'eventList est effacée entièrement après avoir ete jouée n fois.
    - ignore : n'intervient pas dans l'historique 
    - ... 
- timeEvents : la collection de timeevents
- addEventList(event, time) ajoute une liste dynamique)
- seek(time) : rend la coolection partielle des events jusq'à ce temps 
(n'est ce pas plutot géré par clock ?)

eventDatas collecte les données additionnelles à un event enregistré
*/

/* 
this.timeLine :  { id, timeline}[]
id: string
timeline: { time: [name]} : number:string[]
eventDatas[NS][count][name]
*/
import { DEFAULT_NS } from '../data/constantes';

export class TimeLiner {
  constructor(eventLists = {}, id = 'static') {
    this.timeEvents = eventLists;
    this.timeLine = [];
    this.eventDatas = {};
    this.solved = {};
    this.remains = [];
    this.held = false;
    this.addEventList(eventLists, { id });
  }
  _eventDatas(eventLists) {
    const eventDatas = {};
    for (const event of eventLists.events) {
      const NS = event.ns || DEFAULT_NS;
      !eventDatas[NS] && (eventDatas[NS] = {});
      !eventDatas[NS][event.start] && (eventDatas[NS][event.start] = {});
      eventDatas[NS][event.start][event.name] = event.data;
    }
    return eventDatas;
  }

  _mapEvents(eventLists, chrono = 0) {
    this.remains = [];
    this.solved = {};
    this.held = false;
    let list = Array.isArray(eventLists) ? eventLists : [eventLists];

    while (!this.held) {
      this.held = true;
      this.tree(list, chrono);
      list = this.remains;
      this.remains = [];
    }
    return this.solved;
  }

  tree(list, chrono) {
    for (const event of list) {
      const NS = event.ns || DEFAULT_NS;
      !this.solved[NS] && (this.solved[NS] = {});
      let start = null;
      if (typeof event.start === 'number') start = event.start;
      else if (this.solved[NS][event.start])
        start = this.solved[NS][event.start][0];
      else if (event.type === 'action') start = 0;

      if (start !== null) {
        this.held = false;
        const absTime = parseInt(start + chrono);
        this.solved[NS][event.name]
          ? this.solved[NS][event.name].push(absTime)
          : (this.solved[NS][event.name] = [absTime]);
        event.events && this.tree(event.events, absTime);
      } else this.addEvent(event);
    }
  }

  _makeTimeEvents(listEvents) {
    const timeEvents = {};

    for (const NS in listEvents) {
      for (const event in listEvents[NS]) {
        !timeEvents[NS] && (timeEvents[NS] = {});
        listEvents[NS][event].forEach((time) => {
          timeEvents[NS][time]
            ? timeEvents[NS][time].push(event)
            : (timeEvents[NS][time] = [event]);
        });
      }
    }
    return timeEvents;
  }

  found(event) {
    return this.remains.findIndex((e) => e.name === event.name);
  }

  addEvent(event) {
    if (this.found(event) === -1) this.remains.push(event);
  }

  removeEvent(event) {
    const found = this.found(event);
    found && this.remains.splice(found, 1);
  }

  findEventList(name) {
    const eventList = this.timeEvents.events.find((el) => el.name === name);
    return eventList;
  }

  _once(newTl, chrono, index) {
    const timeLine = this.timeLine[index].timeLine;
    let tl = {};
    for (const time in timeLine) {
      if (parseInt(time) < chrono) tl[time] = timeLine[time];
    }
    return { ...tl, ...newTl };
  }

  addEventList(eventLists, { id, chrono, once = false, unique = false }) {
    const mapEvents = this._mapEvents(eventLists, chrono);
    const timeLine = this._makeTimeEvents(mapEvents);
    this.eventDatas = this._eventDatas(eventLists);

    // ajouter aux autres timelines
    const index = this.timeLine.findIndex((t) => t.id === id);
    if (index === -1) {
      this.timeLine.push({ id, timeLine });
    } else {
      if (once) {
        const newTl = this._once(timeLine, chrono, index);
        this.timeLine[index] = { id, timeLine: newTl };
      } else if (unique) {
        this.timeLine[index] = { id, timeLine };
        //TODO effacer l'eventList lorsque tous les event ont été executés
      } else
        this.timeLine[index] = {
          id,
          timeLine: { ...this.timeLine[index].timeline, ...timeLine },
        };
    }
    console.log('this.timeLine', this.timeLine);
    console.log('this.timeEvents', this.timeEvents);
    console.log('mapEvents', mapEvents);
  }

  add(event, options) {
    //  event : {  type: "action", name: "evl03", once: true }
    // options  : { id, chrono }

    const eventList = this.findEventList(event.name);
    event.type === 'action' && (eventList.type = 'action');
    this.addEventList(eventList, options);
  }

  elapsedEvents(time) {
    const elapsed = this.timeLine.reduce((el, tm) => {
      const elp = Object.keys(tm.timeLine)
        .map((t) => parseInt(t))
        .filter((t) => t < time);
      return [...el, ...elp];
    }, []);
    const uniqElapsed = [...new Set([elapsed])];
    // .sort((a, b) => a - b);
    console.log('elapsed, time', uniqElapsed, time);
    return uniqElapsed;
  }
}
