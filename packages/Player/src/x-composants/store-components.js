export default class StoreComponents {
	lib = new Map();

	constructor(Eso, Content) {
		this.Eso = Eso;
		this.Content = Content;
	}

	register(Comp) {
		const Composant = Comp(this.Eso);
		const Content = this.Content;
		if (this.lib.has(Composant.nature))
			throw new Error(`"${Composant.nature}" est déja déclaré`);
		else {
			if (
				Composant.contentType === 'text' ||
				Composant.contentType === 'image'
			) {
				const C = class extends Composant /* extends Eso  */ {
					constructor(perso) {
						super(perso, { init: false });
						this.revision.content = Content.lib.get(Composant.contentType)();
						this.init();
					}
				};
				this.lib.set(Composant.nature, C);
			} else this.lib.set(Composant.nature, Composant);
		}
	}

	create(perso, ...args) {
		const { id, nature } = perso;
		if (!nature) throw new Error(`"${id}" n'a pas de composant déclaré`);
		if (!this.lib.has(nature))
			throw new Error(`${nature} : pas de composant déclaré à ce nom.`);

		const Composant = this.lib.get(nature);
		const C = new Composant(perso, ...args);
		console.log('Composant', C);
		return C;
	}

	raz = () => this.lib.clear();
}
