// import { tween } from "popmotion/lib";
import { tween } from 'shifty';

// tween({
//   from: 0,
//   to: { x: 300, rotate: 180 },
//   duration: 1000,
//   ease: easing.backOut,
//   flip: Infinity
// })

/* 
 TODO
 les interpolations doivent etre découpées selon leur durée, on aura donc un tableau d'interpolation par id.
 si une interpolation s'ajoute aux précédentes,les données sont surchargées.
 
 */

/* 
 à un Actor peut etre associé un tableau de tweens ; si l'on souhaite agir sur l'actor, il faut toucher l'ensemble des tweens. 
 anime serait un objet de clés id et pour valeur une Map de tweens.
 ou bien, un objet contenant les clés lié à un id d'une map générale.
 -> intéret : la plupart du temps, la fonction status est globale à toutes les animations.
 - Faut-il ici distinguer des anims qui ne seraient  pas pilotées par la telco ?
 - stopper les animations d'un Actor est nécessaire quand l'Actor est supprimé.
 
 */
export class ControlAnimations {
  tweens = new Map(); // key:  tween-id, value: tween()
  tweenSet = new Map(); // key: actor-id , values: tween-id[]
  uuid = Math.random();

  status = (status, id = null) => {
    if (id) {
      this.tweenSet.has(id) &&
        this.tweenSet.get(id).forEach((key) => {
          requestAnimationFrame(this.tweens.get(key)[status]);
        });
    } else {
      this.tweens.forEach((tween) => requestAnimationFrame(tween[status]));
    }
  };
  pause = () => this.status('pause');
  play = () => this.status('resume');
  stop = (id) => {
    this.status('stop', id);
    if (this.tweenSet.has(id)) {
      this.tweenSet.get(id).forEach((key) => this.tweens.delete(key));
      this.tweenSet.get(id).clear();
    }
  };

  reset = () => {
    this.tweenSet.clear();
    this.tweens.clear();
    this.uuid = Math.random();
  };

  // new
  tween = (options) => {
    const { id, interpolation, update, pipe } = options;
    // TODO decouper les anims par durée
    this.uuid++;

    let animation = tween(interpolation);
    pipe && (animation = animation.pipe(...pipe));
    const complete = this.completeTween(id, this.uuid, options);

    this.addTween(id, this.uuid);
    this.tweens.set(this.uuid, animation.start({ update, complete }));
  };

  completeTween = (id, uuid, options) => () => {
    this.removeTween(id, uuid);
    typeof options.complete === 'function' && options.complete();
  };

  removeTween = (id, uuid) => {
    if (this.tweenSet.has(id)) {
      this.tweenSet.get(id).delete(uuid);
    }
  };

  addTween = (id, uuid) => {
    if (this.tweenSet.has(id)) {
      this.tweenSet.get(id).add(uuid);
    } else {
      this.tweenSet.set(id, new Set([this.uuid]));
    }
  };

  info = () => {
    console.log('this.tweens', this.tweens);
    console.log('this.tweenSet', this.tweenSet);
    console.log('this.uuid', this.uuid);
  };
}

export const controlAnimations = new ControlAnimations();
