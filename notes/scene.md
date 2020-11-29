## Scene

une scene contient :
- une story-maitre, qui en appelle d'autres;
- controle :
  - telco
  - clock
  - eventTime
- pourrait controler :
  - storeNodes
  - images Collection

- un début et une fin

la story - maitre / template place les layers et les stories de base :
  - un arrière-plan,
  - plan principal
  - layer télécommande/application
  action: move story

  -> il faudrait un automatisme pour enchainer délibérement chaque story l'une après l'autre
le signal de fin de la story est l'event qui déclenche la suivante

début-fin de story appartient-elle à la story ou à la scene ?
-> seule la story sait quand elle se termine -> jeu par exemple
-> reserver les event 'start' et 'end' pour ces emplois-ci

la propriété 'chain' permet d'enchainer plusieurs stories à la suite ; qu'en est-il d'une présentation non-linéaire ? 
- exemple : un quiz où selon la solution, une suite différente est donnée ?
- la logique d'embranchement devrait rester dans le quiz. Ne pas obliger à répliquer la logique ailleurs ?
- cast permet d'appeler des stories 'orphelines' sans lien inplicite

### Une story à besoin :
  - d'un slot 'root' pour s'afficher
  - d'un event start. Si l'event à le nom d'une story, il représente l'event 'end' de cette story

### cast 
liste en détail chaque story employée avec son root et son startAt
  *synomynes : act - present - go - cast - chain*

### chain
est une propriété raccourcie de cast pour simplifier les déclarations lorsque les séquences s'enchainent

### cast et chain peuvent etre utilisés ensemble
les deux propriétés sont fusionnées, cast a priorité si conflit. 

### template peut etre déclaré au niveau du chapter ou meme de l'app
L'application aura toujours besoin de templates différents, pour l'usage du sommaire ou d'une intro par exemple.
template au niveau de la scène permet d'utiliser un modele différent pour l'affichage d'une video par exemple.
dans la meme idée, root peut avoir un nom convenu 

**Une structure identique peut etre appliquée aux chapitres**
Avant de mettre en place des conventions précises, laisser la possibilité de créer les chapitres, scenes et persos dans l'ordre et le nombre de fichiers que l'on veut;


## Note sur la visibilité des éléments et tout facilitateur
La visibilité est  gérée par des events ; chaque composant est censé avoir un *event* 'leave' qui lui permet de quitter la scène.
Dans la rédaction des persos, il peut etre fastidieux de recréer à chaque fois le meme event
une propriété config pourrait servir à définir simplement les comportements par défaut, 
- sur le modele *Defaults* du *Shell*
- ce qui amene aussi à définir l'équivalent des *properties* ; des composants aux propriétés identiques, à l'exception par exemple de *content*, pourraient etre définies simplement

Ces facilités sont conçues pour la rédaction du yaml, et sont transformées en objets complets à l'exécution. 
**Ces fonctionnalités n'ajoutent rien au *core*.**


```yaml
scene: 
  id: scene22
  name: nom de la scène
  template: story00
  root: story00-main
  chain: [story01,story02,story03]
  cast: 
    - story05:
        startAt: story04
        root: story00-main
    - story06:
        startAt: quiz-false
        root: story00-main

# minimal : 
scene: 
  id: scene22
  name: nom de la scène
  chain: [story01,story02,story03]

```

todo
- passer du yaml aux objets core
- appliquer les modifications pour les syntaxes courtes
