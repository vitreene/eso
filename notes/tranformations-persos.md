## transformation des fichiers à partir des sources YAML

L'objectif est de proposer une écriture compacte des fichiers YAML, qui evite la redondance pour limiter les erreurs et améliorer la lisibilité. 
L'écriture développée de certains parametres reste acceptée 

Ces transformations peuvent aller jusqu'à revoir la structure finale des composants, notamment sur ce qui doit etre des objets ou des tableaux.

1. Persos

Les persos sont regroupés dans un tableau. 
Chaque entrée débute par une référence au composant constructeur : bloc, img, sprite...
L'index du tableau servira à tenir l'ordre de création des éléments et leur insertion dans le DOM en cas d'égalité.


## Merge - Extends
Quelles regles appliquer à la propriété extends ?
Le principe est de partager des propriétés communes, ou appliquer des réglages par défaut.
Selon les cas il sera logique d'ajouter des propriétés, dans d'autres de les substituer. Comment choisir ?

actions, listen, emit :
Si une action porte le meme nom que son prototype, elle est substituée.
si un listen à les meme action, event et ns, il est substitué
si un emit est défini une une meme prop, il est substitué

initial:
attributs substitués
content substitué
dimensions substitué
classNames : ajoutés par défaut ; les regles de fusion sont celles de veso
Style : Object.assign
les props ayant la valeur null sont retirées

Si besoin, extends pourrait fonctionner a l'intérieur d'une action/emit pour ajouter les props de base (extends:true)

en résumé : tout est substitué, sauf les styles et classes dans initial
donc, pas besoin de deep merge en fait ?

exemple : une liste d'éléments avec des caractéristiques communes, mais une destination différente
dans l'event, seule la prop  move est à modifier, le reste des props restent les memes -> extends:true


## Story : zoom
Chaque story définit son propre cadre virtuel, dans lequel ses dimensions définitives sont calculées 
ces propriétes doivent rester accessibles, donc il faut créer une objet story :

TODO : différence entre id, channel et level

En créant des objets, cela facilite l'instanciation 
créer toutes les scenes d'un chapitre (elles doivent etre toutes accessibles directement)

### Story
  - id
  - name?
  - description?
  - cadre: l x h
  - zoom
  - root: id
  - composants: liste id, nodes, veso[] ?
  - strap: instances internes à la story 
  - path : id / channel story
  - onEnter, onExit : func
  - kill-story: func
  - nodes et persos : ici ou dans scene ?
  

### Scene
  - id : identifiant de la scène
  - name? : nom affiché direct ou référence
  - description? : notes instructions
  - channel : nom sous lequel les events sont consignés ; identique à id
  - cast : liste des stories
    - story : startAt, root
  - timeline
  - clock
  - nodes et persos : ici ou dans story ?
  - imagesCollection
  - telco : (play, pause, rewind, seek)
  - onStart, onEnd : func


### chapter
 - scene []
 - navigation (precedent, suivant goto, sommaire)

### App
- emitter: event emitter
- chapters : organisation du projet, scénarios
- config :
  - constantes

### Projet
- yaml
- presets
- config
un projet pourrait etre compilé, en ne gardant que les fichiers json, les images calculées pour un rendu zoom 1:1


