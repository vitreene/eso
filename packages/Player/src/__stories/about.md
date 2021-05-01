Metaphores pour nommer les éléments de Eso
une **App** est une suite de **Chapters** composés de suites de **Scenes**
Les Scenes sont alimentées par des **Stories** qui indiquent aux **Persos** leur définition et leur comportement.

A la différence du Shell, il n'a pas besoin d'un découpage des Scènes en suites de **Sequency**.
les Sequency pourraient etre des groupes d'animation autonomes, restant à définir.

### Story
Une Story définit :
- les Persos employés; 
- les **Eventimes** de la Story;
- les **Layers** et les **Slots** où seront placés les Persos;

### Perso
Un Perso contient les propriétés :
- id : nom unique dans la story
- nature : type texte, image, sprite, button, layer...
- initial : apparence du Perso
- listen : tableau d'événements auxquels le Perso réagit
- actions : tableau des réactions modifiant le Perso

Selon sa nature, le Perso disposera de propriétés distinctes.
Les indications de placement du Perso sont définis dans les actions. Pour apparaitre, chaque Perso doit donc contenir au moins un listen et une action.


### Layer
Dans cette version, les layers s'appuient sur des grilles css, ce qui simplifie leur construction. 
Un Layer est une collection de slots, associé à une classe css qui les décrit 
La propriété *layout* renvoie à cette classe, plutot qu'à une définition ?
Une propriété *slots* pourrait définir chacun des slots : à minima, c'est un tableau d'ids, dont *length* indiquera leur nombre

*Pas besoin de plus pour le moment. Créer quelques modeles*

