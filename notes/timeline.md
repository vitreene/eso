# Timeline

au lancement de la scene, consigner les états-clés de chaque perso:
etat-clé : tous les parametres actifs du perso

- les styles et classes
- l'état des transitions

une état-clé est créé :

- en début de chaque action,
- à la fin d'une transition.
  un flag détermine si une transition suit cet état.
  chaque état est lié à un chronometre.

si le pointeur s'arrete entre deux états :

- il regarde le précédent;
- il utilise cet état
- si l'état comporte une transition,
  - calculer la progression
- appliquer la progression

lorsqu'un état-clé est créé, il se peut qu'une précédente transition ne soit pas terminée

- intégrer la progression à l'état,
- transformer le restant en une nouvelle transition.
- si la transition comporte un repeat (Shifty n'enpropose pas de natif)
  - scinder la transition en cours
  - appliquer les suivantes, avec un délai d'exécution de la fin de transition
- si la transition comporte un effet yoyo
  - voir si l'on peut connaitre le sens de l'animation

Il restera à envisager :

- comment enregistrer les intéractions
- certains états ne seraient pas consignés dans la timeline : par exemple, des stories activées par la pause. (ou alors dans une autre ligne de temps, mais je vois pas l'usage sinon débug)

## Où ces états sont consignés ?

les états clés sont reflétés dans les persos, donc, ils effacent d'abord l'état courant, pour ne pas activer les surcharges (comme pour les classes par exemple)
-> il faut un signal pour update, ou bien une méthode "direct"
Eso ne gérant plus les transitions par lui-meme, il n'y a plus non plus de raisons d'y enregistrer les états-clés.
Ceux-ci peuvent etre adjoints au Persos

Lecture de la timeLine
Après SEEK :

- pouvoir lire un extrait de Scene,
- pouvoir commencer à tel event ou time
- lire à l'envers ?
  Lire une scene à l'envers n'est pas forcément pertinent – le son à une direction – mais ca peut etre bien pour une story.
  En principe, il suffirait d'inverser l'ordre des events en calculant totalTime - timeEvent. Cependant, c'est contradictoire avec l'effet de cumul automatique (dans les classes notemment ) construit dans Eso.
  Les timeEvents donnent le point de départ d'une action, pas son aboutissement.
