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

timeLine et sound partagent la necessité de controler le flux des events.
Devant updateComponent, il faut placer le controle de la lecture.

- le flux destiné au son,
- le flux destiné aux Persos
  Play/pause doit préceder le process d'update pour interrompre les transitions en cours.

Pour le moment, Pause interrompt clock et animation. Or, des actions et des animations doivent pouvoir s'executer lorsque on se trouve en mode pause

YAML pour sound

- src
- events pour
  - play
  - pause
  - end
  - stop
  - mute/unmute
  - seek
  - label : se déplacer à une position et jouer
    label -> jouer des sprites audio

comme composant :
créer une classe qui va créer une interface pour audio2d pour jouer le son, emettre des events

**Utiliser "level" de la timeline**
**level** qui pourrait etre renommé, sert initialement à créer des niveaux différents ou les events sont enregistrés.
Par défaut existe un level MAIN, et il y avait eu une tentative pour utiliser un second channel pour les events "à la volée", comme un clic qui génere une serie d'events, qui peuvent etre interrompues ou
oubliées
en théorie, je peux créer autant de niveaux que necessaire;
Il pourrait y avoir un level pour PLAY, un autre pour PAUSE, et encore TEMP pour les evenements "oubliables" si ca a un intéret.
EDIT autoriserait chaque Perso à etre manipulé, en ajoutant les events correspondant : une action vide déclenchée par un event ayant pour nom l'id du perso. La manipulation serait faite par un composant éditeur qui recoit les manipulations et les reporte sur le perso selectionné

l'intéret, c'est qu'il ne faut pas configurer une story pour s'exécuter en mode Pause ; il suffit de placer les events déclencheurs sur le level concerné.
En switchant d'un level à l'autre, il faut pouvoir au besoin garder le temps ecoulé

Comment placer des events sur un level particulier ?
un story doit-elle etre concue pour etre jouée dans un mode particulier ?
exemple : la télécommande :
selon play ou pause, certaines fonctions seront actives ou non, ou bien fonctionneront différement.
donc les eventimes doivent pouvoir etre dispatchés sur un level particulier.
Certaines actions seront disponibles dans chaque mode, donc dupliquées
Les Listen et actions des persos ignorent de quel level vient l'eventtime.

dans le Yaml : comment traiter les eventimes :

- modifier la prop eventimes actuelle pour ajouter la couche level ;
- créer une prop level, chargée de gérer cette complexité, par exemple avec une prop COMMON | ALL, ou bien un tableau comme [PLAY, PAUSE] pour ce qui sera dupliqué. Dans la mesure ou cette prop sera rarement utilisée, la duplication des eventimes ne serait pas trop génante.

PLAY/PAUSE sont des états globaux, y en a-t-il d'autres lié à Scene ?

Comment fonctionne SEEK dans ce contexte ?
SEEK déclenche PAUSE par défaut, mais à besoin de lire les events dans PLAY ?
Il peut les chercher dans timeline sans avoir recours à Clock

> A retenir :
>
> - une action "id", vide, unique a chaque perso
> - level pour cloisonner des actions liées à l'état PLAY/PAUSE

## YAML

est-ce sound doit etre traité avec la meme interface que Perso, ou doit-elle rester plus simple ?

- plus simple dans le YAML
- si sound utilise la meme interfce, ce sera plus simple et moins spécifique ?

```yaml
  - sound:
      src: ./sounds/microphone-countdown-341.mp3

  - sound:
      id: count
      src: ./sounds/microphone-countdown-341.mp3
      play: e01
      complete: { channel: *MAIN , name: '${story.id}.complete' }

  - sound:
      id: count
      src: ./sounds/microphone-countdown-341.mp3
      listen:
        - {e01: play}
        - {channel: *TC, event: pause, action: pause}
      actions:
        play: {play: true}
        pause: {pause: true}
      emit:
        complete :
          event: { channel: *MAIN , name: '${story.id}.complete' }
```

- cas 1
  - uniquement la src
  - start = event de lancement de la story
  - id = story.src
    un son, comme un sprite, pourrait etre joué plusieurs fois. mais il doit etre déclaré une seule fois par story
    L'action complete par défaut sera ${sound.id}.complete
    Les actions play et pause sont automatiquement ajoutées.
- cas 2
  play et complete sont des raccourcis pour action et emit

Faut-il faire un objet par son, comme pour perso ?
-> catalogue de sons pour la scene, avec un accès à chacun par son id
ou classe gérant les ressources sons, auxquels on accède par l'id et la méthode voulue. Cela revient au meme, et c'est plus compliqué à gérer avec 2 params pour accéder au son
