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
  // un template selon le support ?
  template:
    desktop : scene-w-telco-d
    tablet :  scene-w-telco-t
    mobile :  scene-w-telco-m
  // template est une story ou un composant ?
  template:
    scene-w-telco:
      startAt: go
      root: *CONTAINER_ESO
  cast: 
    - story00
        startAt: go
        root: *CONTAINER_ESO
    - story01
    - story02
    - story03
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
  cast: [story01,story02,story03]

```

```js
const story = new Story(_story, startAt, rootID)

```

todo
- passer du yaml aux objets core
- appliquer les modifications pour les syntaxes courtes


## Deux facons d'incorporer des stories dans une scene :
1. une story peut etre déclarée dans une autre story ;
2. les stories sont déclarées dans la scène, un event monte chaque story, comme pour un composant. 
Il faut s'assurer que le slot soit présent lorsque l'event est lancé
C'est finalement une question d'écriture : techniquement, cela devrait revenir au meme.

un composant d'une story n'est pas censé "passer" dans un autre ; les échanges se limitent aux messages

## instance d'une story
utiliser extends, commme pour les composants

## portée des messages
le channel par défaut est celui de la story ; le canal "main" est dédié à la scène elle-meme ; un strap peut intercepter des messages et les redistribuer à une story en particulier, la story la disptache à ses composants.
Si on a besoin d'une communication inter-stories, nommer chaque instance des stories.
Le nom d'une story sera le nom du channel
dans story : name = id = channel 

## appartenance des fonctions 
### App
- fetch
- constantes
- emitter

### Chapter

### Scene
  quelle partie peut le remettre à zéro ? les events liés à la télécommande peuvent-ils etre rénitialisés à chaque changement de scène ?
- runtime
- images-collection
- slots
  slots et persos sont liés, c'est contradictoire de les affecter à un niveau différent
- straps/
  straps liés aux scenes, si necessaires
- Stories


### Story
- zoom
- composants/
- register/
- straps/
  straps liés aux stories
- on-scene 
  pour un fonctionnement en silo 
- persos
  les persos de différentes stories ne communiquent pas entre eux directement
- 

### répartir les charges entre Scene et Story
- Story dépend de Scene, ils peuvent partager des ressources
faut-il un découpage logique, ou avantageux :  
une story instanciée se peut se dérouler que dans une scene, elle ne sera pas détachée.
Les propriétes de Story comme le zoom, pourraient etre rajoutées à chaque perso ? 
Story délimite la portée des events , des straps ; un préfixage suffirait ?
storeNodes, nodes dans Scene, pourrait etre injecté dans Veso, plutot que le contraire actuellement.


Que désigne le package Player ?
- scene
- app
App sera différent selon qu l'on sera sur veso ou vitreene ; en commun : scene


## notes : packages utiles
detecte un resize
https://www.npmjs.com/package/element-resize-detector
etendre yaml : 
https://www.npmjs.com/package/geneva


Et si appContainer devenait un composant veso ?


## Hypotheses
- scene: template devient entry. 
La story désignée par entry est incorporée en premier
idem pour story : entry désigne le premier composant affiché. entry va etre placé dans root et recevoir un event start-story-xx. Il suffirait de lier une action move: root pour lancer la story 

- slots
slots pourrait disparaitre ; son id est remplacé par une path qui désigne le *content* d'un Perso. Par défaut, content est déjà un élément réactif. 
un slot permet de cumuler plusieurs élements, alors que content n'en admet qu'un 
donc slot est un tableau de contents
un content defini comme slot devrait le rester, ne pas permetttre un autre type de contenu.
globalement, il vaudrait mieux garder le meme type de conteu le long de la vie d'un element.
(mais : remplacer un tete brut par un texte enrichi html par exemple ? )

Un transform permet de développer les ids des slots en paths

- List : composant virtuel
Le composant virtuel List va remplacer Layer. 
Un composant virtuel n'existe que dans les fichiers yaml. Un transform le convertit en objet régulier.
List sera un Bloc, conteneur d'une série de Blocs. Comme pour Layer, le slot sera cerné par un élément HTML. 

On pourrait constituer un catalogue de Lists qui seraient activées par un extends

- paths / key
La hiérarchie d'un scene est : Scene > Story > slot | event
l'App ne peut afficher qu'une seule scène à la fois. Les Stories ont un id unique, ainsi que les Persos. 
En cas d'instanciation, la combinaison storyId.persosId est unique.
En cas de liste générée, les slots suivront une numérotation selon l'index 
le terme "key", ou serait plus approprié : 
- uuid suggère un id généré au hasard
- path suggère un chein complet dans la hiérarchie des éléments, il n'en est rien : un persos peut passer d'un slot à un autre sans changer de "key"
- id est le terme proposé par l'utilisateur à l'écriture, un id est généré si absent

Lorsque des éléments sont générés dans une list, quels keys prennent-ils par défaut ?
- storyId.persoListId.slot_01 
- storyId.persoListId_slot_01 
il faut eventuellement pouvoir acceder a la numerotation, mais garder une autre convention que le point comme separateur
