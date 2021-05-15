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

difficultés :
certaines propriétés, comme move, ne sont pas censées etre calculables à l'avance ?

pour chaque étape où une transition est en cours, ne calculer que la progression, et laisser la résolution des valeurs au moteur de transition, qui doit tenir compe de cette valeur "progress"
-> idem pour move donc
-> mettre en cache les valeurs de position des slots ?

```json
"solved":{
  "story01":{
    "end-story01": [12000],
    "quarter1": [0, 8000],
    "quarter2": [2000],
    "quarter3": [4000],
    "quarter4": [6000],
    "start": [0]
}},

"timeLine":{
  "main":{
    "story01":{
        "0":  ["start", "quarter1"],
        "2000": ["quarter2"],
        "4000": ["quarter3"],
        "6000": ["quarter4"],
        "8000": ["quarter1"],
        "12000": ["end-story01"],
    }
  }
}

"listen":[
{"event": "move-text", "action": "move-text", "channel": "main" },
{"event": "quarter1",  "action": "quarter1",  "channel": "story01"},
{"event": "quarter2",  "action": "quarter2",  "channel": "story01"},
{"event": "quarter3",  "action": "quarter3",  "channel": "story01"},
{"event": "quarter4",  "action": "quarter4",  "channel": "story01"},
]

"actions": [
{"name": "quarter1", "move": {}, "transition": {}, "content": {}}
{"name": "quarter2", "move": {}, "transition": {}, "content": {}}
{"name": "quarter3", "move": {}, "transition": {}, "content": {}}
{"name": "quarter4", "move": {}, "transition": {}, "content": {}}
{"name": "move-text", "font-weight": "48px"}
]

// en supposant des transitions par défaut de 500 :
"snapshots": {
  "0":    {"name": "quarter1", "progress": 0, "style":{"props":"from"}, "content": {}, "move": {}, "transition": {} },
  "500":  {"name": "quarter1", "progress": 1, "style":{"props":"to"}, "content": {}, "move": {}, "transition": {} },
  "2000": {"name": "quarter2", "progress": 0, "style":{"props":"from","content": {}, "move": {}, "transition": {}, },
  "2500": {"name": "quarter2", "progress": 1, "style":{"props":"to"}, "content": {}, "move": {}, "transition": {}, },
  "4000": {"name": "quarter3", "content": {}, "move": {}, "transition": {}, },
  "6000": {"name": "quarter4", "content": {}, "move": {}, "transition": {}, },
  "8000": {"name": "quarter1", "content": {}, "move": {}, "transition": {}, },
}

```

procédure :
pour chaque Perso :

- pour chaque listen :
  - determiner le time en le cherchant dans solved
  - reporter l'action. si il y a une transition :
    - extraire from, fusionner avec style, progress: 0
    - créer une nouvelle etape à time+duration : extraire to, fusionner avec style, progress: 1
      mais si il y a une autre étape auparavant ?
      progress = time2-time1 / duration
      faut-il faire plusieurs passes:
    - placer les actions,
    - puis créer les étapes ?
      sachant qu'en cas de transitions rapides, il peut y avoir superposition de transitions
      et que le résultat doit etre identique à une lecture normale
      A chaque création d'étape, il faut morceler chaque transition si elle empiète sur une autre étape
      fusionner les transitions, avec des durées différentes

-> transition doit accepter un tableau de transitions avec des durées différentes

```

```

souci sur les transitions

les transitions sont préparées en listant d'abord toutes les props concernées. ainsi, chaque transition peut etre appelée de façon constante, sans cumuler de modifications
comment appliquer ces modifications lorsque plusieurs transitions ont lieu sur un meme evenement ?

- fragmenter les transitions selon la durée : compliqué, mais cette méthode sera utilisée pour la timeline
- filtrer les prop qui démarrent ensemble ?

décrire le cas : un transition commence alors que la précédente n'est pas terminée, et porte sur les memes propriétés ?

- idéalement, il faudrait réduire progressivement l'influence de la valeur précédente jusqu'à la fin prévue de la transition.

- si la premire transition est plus longue que la seconde,

que sont eso.from et eso.to ?

- **Eso.from** est un snapshot des propriétés de style au début de la transition.
- **Eso.to** : valeurs initiales des propriétés de style utilisées par les transitions

lors d'une transition, si d'autres transitions ont lieu en meme temps,

- filtrer quelles propriétées initiales ne doivent pas etre utilisées.
- Les rendre en fin de transition.
  -> si deux transitions se servent de la meme prop, c'est la premiere qui l'emporte; mais si la seconde est plus longue, elle reste muette.

quelle est la durée d'une transition ? c'est à dire, à quel moment est-elle considérée comme terminée ?
si les valeurs par défaut ne sont pas concernées, celles-ci vont transiter avec une valeur par défaut ?
-> donc une transition déclencherait une autre où tous les élements reviendraient à leur valeur initiale. Cette transition serait **moins prioritaire**, et aurait une durée par défaut.

Priorité des transitions
les transitions les plus récentes sont prioritaires sur les autres
