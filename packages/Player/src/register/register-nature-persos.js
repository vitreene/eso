import ComposantLib from "./composant-lib";
import { Layer } from "../composants/Layer";
import { Bloc } from "../composants/Bloc";
import { Button } from "../composants/Button";
import { createImgClass } from "../composants/Img";
import { createSpriteClass } from "../composants/Sprite";

export default function initCreatePerso(imagesCollection) {
  const createPerso = new ComposantLib();
  const Img = createImgClass(imagesCollection);
  const Sprite = createSpriteClass(imagesCollection);

  createPerso.register(Layer);
  createPerso.register(Bloc);
  createPerso.register(Button);
  createPerso.register(Img);
  createPerso.register(Sprite);
  return createPerso;
}
