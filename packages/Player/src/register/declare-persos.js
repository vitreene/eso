import ComposantLib from './composant-lib';
import { Layer } from '../composants/Layer';
import { Bloc } from '../composants/Bloc';
import { Button } from '../composants/Button';
import { Img } from '../composants/Img';
import { Sprite } from '../composants/Sprite';

export default function initCreatePerso() {
	const createPerso = new ComposantLib();
	createPerso.register(Layer);
	createPerso.register(Bloc);
	createPerso.register(Button);
	createPerso.register(Img);
	createPerso.register(Sprite);
	return createPerso;
}
