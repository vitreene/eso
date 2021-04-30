# Sound

comment synchroniser les sons et les events
Faire en sorte qu'un event qui à lieu par exemple 4s après le départ d'un son se fasse bien à ce moment la

- Le systeme basé sur TimeOut est trop imprécis et irrgulier
- utiliser le currentTime d'un AudioContext
- utiliser la différence entre le départ de l'audioContext et le startClock comme base de temps.

- déclencher les events en fonction de l'avancée de currentTime
  un modele :
- lister tous les timeEvents dans un tableau, traiter tous les events en dessous de currentime, puis les effacer
  ce traitement pourrait se faire dans un requestAnimationFrame
  -> rAF est appelé 60f/s , la granularité des events est de 10f/s

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
