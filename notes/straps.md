## Straps

Les straps permettent d'ajouter de la logique à une scène, en utilisant le systeme d'eventEmitters pour envoyer des messages aux composants.

### usage

Etats des composants

- state
- bascule
- options cycliques
- minuteur
- compteur
- ajoute des events à la timeline

Intéractions avancées

- move, rotate
- drag-drop

Traitements

- quiz
- jeux

side-effects

- scorm

### présentation d'un strap

Un strap pourrait se présenter comme une classe disposant de propriétés lui permettant d'envoyer et recevoir des events et relié à la scene.
une méthode "declare" permet de générer l'activation et la désactivation automatique de l'emetteur

Un strap est déclaré dans le projet, puis est requis par la scène.
Certains sont liés à un projet unique,et font partie des ressources du projet.

Par défaut, les events emis depuis un strap sont consignés dans la timeline
