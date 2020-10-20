import initCreatePerso from "./register-nature-persos";

export function registerPersos(stories, imagesCollection, emitter) {
  const persos = new Map();
  const createPerso = initCreatePerso(imagesCollection);
  (Array.isArray(stories) ? stories : [stories]).forEach(story => {
    switch (story.nature) {
      case "sound":
        break;
      case "polygon":
        break;
      case "layer":
      case "bloc":
      case "button":
      case "img":
      case "sprite":
        persos.set(story.id, createPerso.create(story, emitter));
        break;
      default:
        break;
    }
  });

  return persos;
}

export function initPersos(persos, emitter) {
  const persosWithEmitters = {};
  for (const id in persos) {
    persosWithEmitters[id] = persos[id](emitter); //.update;
  }
  return persosWithEmitters;
}
