import ComposantLib from '../Scene/register/composant-lib';
import { Layer } from './Layer';
import { Bloc } from './Bloc';
import { Button } from './Button';
import { Img } from './Img';
import { Sprite } from './Sprite';

export default function initCreatePerso() {
	const createPerso = new ComposantLib();
	createPerso.register(Layer);
	createPerso.register(Bloc);
	createPerso.register(Button);
	createPerso.register(Img);
	createPerso.register(Sprite);
	return createPerso;
}
