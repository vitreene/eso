export default class ComposantLib {
  static singleton = false;
  constructor() {
    if (ComposantLib.singleton) return this;
    ComposantLib.singleton = true;
    this.lib = new Map();
  }

  register = Composant => {
    if (this.lib.has(Composant.nature))
      throw new Error(`"${Composant.nature}" est déja déclaré`);
    this.lib.set(Composant.nature, Composant);
  };

  create = (story, emitter) => {
    const { id, nature } = story;
    if (!nature) throw new Error(`"${id}" n'a pas de composant déclaré`);
    if (!this.lib.has(nature))
      throw new Error(`${nature} : pas de composant déclaré à ce nom.`);

    const Composant = this.lib.get(nature);
    return new Composant(story, emitter);
  };

  raz = () => this.lib.clear();
}
