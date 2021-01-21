# Les chantiers

## Fait

### un système d'écriture des fichiers en yaml
    - definition de la syntaxe 
        - definition des persos
        - definitions des events
        - défintion des pages, chapitres...
        - ressources langues
    - parser

## En cours

### Scene 
Une scene est une compostion d'une ou plusieurs stories. 
? Une story ne peut apparaitre qu'une seule fois dans une scene -> sauf si isolation des events et mecanisme d'events partagés
? Une story peut-elle en contenir une autre, ou bien une scene peut en contenir une autre ?

**-> Une story peut etre instanciée dans plusieurs scene, ou dans la meme scene ; il lui faut un id unique.**

#### instanciation d'une story
-> Dans le contexte du shell, peu utile. Mais pour vitreene ?
une story pourrait-elle néanmoins apparaitre une fois dans deux scenes imbriquées dans une troisième ?

Comment isoler une story pour pouvoir l'instancier ?
Distinguer les composants qui appartiennent à Story et à Scene

il faut :
#### root
Le point d'entrée est unique et distinct. Il dépend du parent.

#### zoom et cadre
La story se joue dans un cadre virtuel, centré dans le slot où il est monté.
Le zoom est calculé par rapport au parent, mais il n'est recalculé qu'en cas de resize global de la fenetre
amélioration possible, un listener sur le parent ; attention à des boucles infinies si l'enfant modifie la taille du parent 

#### id's
Les persos ne doivent pas pouvoir s’« appeler » par leurs id. Seuls les messages des events permettent de les modifier. 
Les ids doivent etre générés aléatoirement.

Á refléchir : une propriété "label" qui a le role d'un id, défini par l'utilisateur, pour addresser quelque chose au perso nommé (cela contredit l'affirmation précédente ). 
Cela pourrait servir pour utiliser des composants tierce-parties qui cherchent un node à partir de leur id

Les id peuvent etre préfixés par le nom de la story

#### events
Les events agissent dans un contexte, par défaut celui de la story 
Par défaut, les évents définis à l'intérieur d'une story n'agissent que sur elle.
si un perso doit répondre à un event, il utilise le canal "main" 
les stories pourraient aussi capter des events "main" et les transmettre en interne
eventemitter2 permet de chainer les channels, cela pourrait servir à mieux préciser une cible 


### structure d'une page, et de l'application
Organisation du monorepo
un workspace *Project* destiné à y placer les contenus 
- medias
- yaml
    - summaries
    - chapters
    - scenes
    - stories
    - config
- css

### micro-animation sur les textes
    - effets nommés 

### refs et langues pour les textes
ref et langues pourraient etre résolues lors du parsage, et autoriser une écriture simplifiée en intégrant des réglages par défaut.
Cependant, si je garde la possibilité de modifier un contenu au runtime (compteurs, inputs...), il faut garder de la logique dans le composant

## A faire 

### un éditeur visuel

### parametres d'application :
    - langue, sous-titres,
    - zoom ?
    - lecture auto / plein ecran / contraintes globales de lecture

### import images dans fetching
-> la création de scene devient synchrone

### play/pause controle les animations par un update régulier

### timeline
- enregistrer les animations
- garder l'état des  straps


## TODO janvier 2021

### Story

### Composant Audio
- events on Complete
- pilotage par telco

### questionnaire
- composant
- etat
- validation

### Composant Video

### jeu en yaml
- modeles
- strap lié à une story
- relancer / reinitialiser le jeu

    
## bugs/améliorations

- **Transform yaml** : dans les stories, extends ne fonctionne pas avec les persos externes. 
	Revoir le système de passes :
		- objet 'proto', du meme niveau que scene, dans lesquels seront placés tous les prototypes ET éléments partagés. Les éléments non utilisés sont effacés.
		- un proto peut etre défini à l'intérieur d'une story, sa portée est la story, en cas de conflit de nom, il est prioritaire.
		- un élément défini dans 'proto' n'a pas besoin d'etre défini comme proto.
		- proto contient des persos, et des stories. 
		- d'autres éléments pourraient etre ajoutés : eventimes, medias ?
		- les éléments de proto comportant des extends sont résolus avant d'etre employés dans les stories. 
		- un extend dans proto ne peut pas se référer à à un proto dans une story.
		
		chaine d'héritage :
		- proto du type de perso
		- persos dans proto
		- persos dans proto/story
		- proto dans scene/story
		- persos dans scene/story


- veso/ "pre"
**preparation des modifications**
concerne : dimensions, move, transitions
séparer ce module du reste de veso ; en fait-il partie ?
lié à veso : besoin d'accéder à l'état du perso : node, css...
distinct : précède le calcul d'un rendu.

quelles infos sont ajoutées l'historique : les données en entrée ou en sortie de 'pre'

'pre' calcule les propriétés qui ont besoin d'accéder à node avant l'update
'pre' lance les interpolations 
'pre' pourrait :
- gérer et controler les interpolations, pour invalider une transition lorsqu'une autre est ajoutée, par exemple,
- recalculer une nouvelle interpolation au cas ou une nouvelle vient s'ajouter à celle en cours (animation additive)
- transmettre les play/pause via l'update


**etats du composant**
l'état du composant est incrémental, ses évolutions s'ajoutent au fur et à mesure du récit. 
il faudrait pouvoir nommer des états et faire en sorte que l'on puisse passer de l'un à l'autre.
Pour faire des transitions correctes, il faut connaitre toutes les propriétés que l'on va modifier sur la vie du perso.
Il faut traverser toutes les actions et definir pour chaque état/action le groupe à eventuellement animer.
Definir un groupe de propriétés par défaut parmi les plus courantes (notamment sur les transformations et positions)
On peut surcharger un état pour définir un nouvel état.
Exemple :
- un bloc texte est bleu, devient jaune quand il se déplace vars un nouveau slot, redevient bleu lorsqu'il est déplacé une seconde fois.
le terme "redevient" est difficile aujourd'hui a déterminer.

**Controle des animations**
les animations sont lancées par veso et sont controlées globalement par telco.
il faudrait que l'on puisse controler l'etat play/pause par une action sur le perso
par exemple, certains composants doivent etre joués lorsque le bouton pause est activé.
La pause pourrait etre passée à la story qui dispatche ensuite l'action sur ses composants.
La story peut transformer l'action en local et l'inverser
il faut donc définir des actions/listen pour une story

**La story est un super-perso** 
Ajouter à story actions/listen 
Sur l'exemple play/pause, cela permet d'inverser le role de play et pause, 
Les persos reagissent à story.play / story.pause, la story transforme scene.play en story.pause par exemple

