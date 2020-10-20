import { DEFAULT_NS } from "../data/constantes";

export function registerActions(stories, emitter) {
  const actionsList = [];

  for (const story of stories) {
    const { id, listen, actions } = story;

    listen &&
      listen.forEach((e) => {
        const NS = e.ns || DEFAULT_NS;
        const { name, ...other } = actions.find((a) => a.name === e.action);
        const action = {
          NS,
          name: e.event,
          data: {
            id,
            action: name,
            ...other,
          },
        };
        actionsList.push(action);
      });
  }

  const pub = (story, handler) => (other) => handler({ ...story, ...other });

  const sub = (handler) => ({ NS, name, data: story }) =>
    emitter.on([NS, name], pub(story, handler));

  return function subcriptions(handler) {
    return actionsList.map(sub(handler));
  };
}
