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

## Comment intégrer Sounds ?

- sera-t- il un modele pour video ?

pour traiter simplement les evenements sound doit etre présenté comme un Perso avec l'interface Eso {node, update, prerender}
sauf que seul update peut etre utile.
Avoir un perso pour le son permet de simplifier la gestion des update events, mais complique le reste ; il vaudrait mieux avoir un traitement séparé pour le moment, à voir plus tard si l'on peut se rapprocher du cas général.
Video va procéder de sound et de Composant avec les deux interfaces à gérer

hypothese : ajouter une interface play à Eso ?

- permettra de piloter l'état du jeu du Perso quand je passerai le controle des animations par le système général ?
- Pour la timeLine -> seek, il faudra aussi proposer un rendu direct de l'état, sans les calculs d'incrementation de l'état du Perso
  A quel niveau prendre la décision de partir sur update ou une autre entrée ?

que contiendrait l'interface play

- la facade animation :
  - play
  - pause
  - seek
  - cancel ? : termine l'animation ?

Mais Eso ne gere plus les animations, cela se passe au niveau d'updateComponent.
-> donc c'est à ce niveau que cela doit se gérer
-> Eso doit pouvoir accepter un paramètre "direct" comme pour les transitions, qui remplace l'état actuel du composant par celui qu'il reçoit.

donc updateComponent recoit un état play/pause/seek signalé dans changed
