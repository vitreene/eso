import { DEFAULT_NS } from '../data/constantes';

export function registerActions(stories, emitter) {
  const actionsList = [];

  for (const story of stories) {
    const { id, listen, actions } = story;

    listen &&
      listen.forEach((e) => {
        const NS = e.ns || DEFAULT_NS;
        const actionFound = actions.find((a) => a.name === e.action);
        if (actionFound) {
          const { name, ...other } = actionFound;
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
        } else
          console.warn(
            'l’action %s n’a pas été trouvée. Vérifier les persos.',
            e.action
          );
      });
  }

  const pub = (story, handler) => (other) => handler({ ...story, ...other });

  const sub = (handler) => ({ NS, name, data: story }) =>
    emitter.on([NS, name], pub(story, handler));

  return function subcriptions(handler) {
    return actionsList.map(sub(handler));
  };
}
