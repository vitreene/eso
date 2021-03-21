
# Articulation d'un projet
**séparer le player du projet**
chaque projet aura un script minimal qui permettra de charger ses propres ressources dans le player :
- straps
- tout js
- style (avec scss)
- medias



## Structure des Documents
Les fichiers internes de l'app seront en json, mais comment seront lues les  instructions de construction ?

L'approche par composant, décrivant ses états selon les events, fonctionne pour des situations d'interactivité, tel un jeu.
Pour une narration, typiquement, une suite d'images, de textes synchronisés sur un son, l'approche par composant est confuse.

selon le cas, on préférera 
- la description par evenement, p. ex:
    - à 'go', afficher les layers, puis la première photo
    - à 'event01, afficher img01,..

- la description par composant, p.ex :
    - galerie : à 00:01, afficher img01, à 00:12, img02, ...
    - list : à 00:02, ajouter titre01, à 'event01', ajouter titre03, ...
    - subtitle: à 00:01, est sub01, à 00:04, est sub02, ...

chaque composant doit etre défini. A la différence du Shell, je peux definir un seul 'sub' et lui attribuer autant de contenu texte que necessaire.
Les définitions de texte peuvent etre aussi du yaml

une narration aurait besoin d'une structure comme :

```yaml
eventimes:
  - start: 0
  - go: start + 0.5

# approche par event
when: #eventime
  start:
  - layer01:
    - move: root
  - layer02:
    - move: layer01-slot01

when: 
  go: 
  - item1: [move: 'slot1', transition: 'fadIn']
  - item2: [move: 'slot3', transition: 'fromLeft']
  - item2:  
    - move: slot3
    - transition :
        to : {x: 0, y: -200, scale: 1.2, backgroundColor: 'red'} 

# approche par perso
perso: 
  - subtitles: # id du perso
      content:
        when:
        - go:  'ref-text-01'
        - +2:  'ref-text-02'
        - +15: 'ref-text-03'
  - list:
    content: [ref1,ref2,ref3]
      when: go
      stagger: 0.25


strap:
 game: {when: {go: ''}}

```

## rejoindre le Shell
avec seulement quelques composants dédiés, on peut rapidement reproduire l'essentiel des présentations. Il faut

- le composant Listes : 
  - accepte une liste de textes affichée par event. 
  - options : indicateur flèche
  - numérotation
  - bloc de fond adaptatif

- le composant Carousel :
  - accepte une liste d'images affichée par event
  - dimensions arbitraires, par défaut son conteneur
  - fonctions de transitions
  - fonctions de pilotage
  - composant lié navigation

- composant Grille :
  - répartir le contenu dans une grille
  - parametrable
  - regles  d'apparition / disparition des elements

- un Strap Quiz et ses variantes du Shell
  - true/false
  - choice
  - drag-drop
  - links

- un composant et Strap Input
  - texte, image, les deux
  - états : coché, décoché, neutre, pristine, correct, incorrect

## un template de base

## La story
un groupe de persos et d'events 
plusieurs story dans une scène, une seule instance de story dans une scène


## sur les Quiz
Les quiz devraient utiliser un composant Liste ou Grille pour y placer chaque Input
comme pour tous les composants, la logique est gérée par des straps :
- creation et composition des inputs
- saisie, validation et réactions
- correction

sur la partie Saisie :
- validation immédiate ou différée
side effects : 
- bouton de validation lance la correction
- minuteur
- compteur de tentatives
- compteur de progression

partie Correction
- event selon le résultat
- side-effect : envoi des résultats vers scorm


## micro-animations des contenus
transitions prédéfinies 
- textes : animation des lettres
  - transitions
  - apartitions
- images : transitions 
  - par fondus
  - par volet

## structure de Story
en première intention, Story regroupe eventimes, channel/id et persos

```yaml
- id?: story01
  channel: story01
  lang?: fr
  eventimes: {}
  persos: []

```

Si un élément de persos est une string, elle designe un perso défini ailleurs
- les id des persos en référence sont renommés pour etre uniques ?
- un perso défini dans une story est ajouté dans la liste des persos, est-il renommé avant ?
- **fonctionne comme un extend**

id et channel distincts ? ils servent à des choses différentes
- s'il manque l'un, l'autre est créé par copie
- si les deux manquent, warning ? === désactivé


Que faire en cas de conflit d'id ?
- est-ce intentionnel ?
  - la propriété extends rend l'intanciation intentionnelle
  - si conflit, renommer le perso, warning sur le conflit
  - instancier des listen avec un channel nommé risque de générer des effets incontrollés.
  - il faut réécrire les events pour les rendre singuliers
  exemple : deux listes avec glisser-déposer entre les deux ? chaque élément ne doit déplacer que lui-meme
  Utiliser des modeles dans ce cas. 
  
## Définir des modeles
différent de extend ? ne suffit-il pas de redéfinir les parties surchargées ?
les valeurs à modifier sont des variables, pas des expressions
un modele est concu pour etre dupliqué, il peut fonctionner avec extend !
- créer d'abord le perso étendu
- passer en revue le perso à la recherche de valeurs à remplacer (clés et valeurs)
- créer une map avec la valeur à remplacer en clé et un tableau de chemins
- ou bien, lors du parsage, faire les substitutions au fur et à mesure

Un perso a besoin d'un channel pour localiser ses actions. si channel n'est pas défini, que faire :
- ne pas ajouter channel : le perso a été défini en dehors d'une story, il ne peut etre utilisé tel quel. channel sera invoqué lorsqu'il sera instancié.
- inconvénient : un mécanisme plus général des modèles serait plus adapté

**différence extends/variable**
extends est une étape préalable à la construction de perso, les variables sont appliquées en fin de définition

### fin de story et passage à la story suivante

- recupérer les stories
- si le cast est *string* :
	- ajouter un event *start-story* :
		- le nom de l'event end précedent devient le start du suivant
- dans tous les cas
	- ajouter un event *end-story* s'il n'y en a pas

Les events end :
channel main : end-*« nom de la story »*
channel de la story : end-story
dernière story : end-scene ?

La scene va passer ces events à la story, mais où les placer pour les déclencher ?
- les placer à la main : 
  - à la fin des eventtimes:
  {startAt:'end-story', channel: 'main', name:'end-*« nom de la story »* }
  il doit exister un event 'end-story' qui délèguera l'event 
  - par défaut, sur l'event 'complete' d'un media son ou video 



## structure de fichier 
- App
- Project
- Chapter
- Scene
  - metas
  - story
    - metas
    - persos
  - shared
    - stories
    - persos  

- shared
  - stories
  - persos
- prototype des composants

Chaque fichier peut contenir un objet  prototype. Ces objets sont fusionnés à chaque fois.
Les objets App, Project, Chapter ne contiennent pas de prototypes.
Techniquement, scene peut avoir aussi un objet prototype distinct, mais ce ne serait pas logique.
Il peut exister un fichier ne contenant que les protos. 
Il peut exisiter un objet protoype dans une scene. Il herite de l'objet prototype général, mais n'est pas ajouté à celui-ci.




Chaque niveau peut en fait abriter les memes ressources, le fonctionnement reste le meme :
Les protos de niveau supérieur sont traités en premier, et sont surchargés par les niveaux suivants.
Exception des définitions de composants qui sont traités seulement au niveau de l'app.
Il doit exister la possibilité d'une définition "nue" d'un perso qui ignore tout héritage ( extends: none)
Laisser peu de contraintes sur ce qui doit etre hérité, utiliser plutot des conventions pour recommander / dissuader un usage.

prototype va s'enrichir, niveau par niveau, de nouveaux composants proposés  en ressources
chaque element en proto doit 
- posséder un id unique
- pas d'instance
- résolution des chaines d'héritage : pas d'extends 

configuration par défaut d'un composant 
désigner dans une variable le nom d'un perso, qui sera automatiquement appliqué si extends: none n'est pas employé
Les configurations par défaut doivent etre les plus faibles possibles

Les ajouts de type play/pause pourraient etre définies dans les composants par défaut ? 
-> ces actions ont vocation à s'exécuter dans le contexte de leur story. Un post-traitement serait plus adapté pour bénéficier du contexte.

Pour les niveaux app, Projet, chapitre

(niveau, heritage)
definitions = heritage.definitions +  niveau.definitions
persos = merge-extends(heritage.persos + niveau.persos)
stories = merge-extends(heritage.stories + niveau.stories)
scenes = merge-extends(heritage.scenes + niveau.scenes)

heritage = definitions, persos, stories, scenes

mettre en cache heritage au niveau du chapitre / session storage

pour le niveau scene, Perso[] en sortie

## un autre modele ?
Objectif : garder une structure flat, limiter le niveau d'imbrication
Dans un fichier, permettre dans ce cas des entrées **persos**, **stories** et **scenes**
Leur portée est limitée au fichier traité
Pour une portée générale, placer dans un objet **prototype**

Maintien de la stucture imbriquée  dans l'écriture du fichier yml:
permet des définitions implicites du casting : si l'objet cast est omit, les stories se succedent l'une après l'autre
dans la phase "pre", générer le cast, puis reverser les stories imbriquées dans l'objet stories ?


## Convention de découpage des fichiers
Les objets **project** et **chapters** peuvent avoir leur propre fichier
Hiérarchie pour les scenes :
- scene > stories > persos 
- scene > cast, stories > persos | extends, protos

Créer un objet project lorsque les chemins de chargement sont résolus.

```js
const projet: {
  id,
  metas: {
    name,
    languages
  },
  summaries: [],
  chapter:{
    id,
    name,
    description,
    cast:[],
    prev,
    current,
    next,
    time: {
      progress,
      abs
    },
    isPlaying
  },
  scenes: []
}
```

## Résoudre les chemins de chargement. 
Laisser des facilités au niveau des structures de fichiers implique d'avoir à les définir quelque part.
Hypothèses : 
- chemin implicites et explicites. Si aucun chemin n'est défini, par défaut, le fichier prendra le nom de l'id du chapitre, idem pour les scenes et les protos. 
Les persos et stories ne sont pas définis dans un chemin par défaut.

projet
  |- chapters
      |- shared.yml
      |- chap01.yml
      |- chap02.yml
      |- chap03
          |- shared.yml
          |- scene01.yml
          |- scene02.yml
          |- scene03.yml
          |- scenes04-10.yml
      ...
  |- languages
      |- fr
      |- de
  |- medias
      |- chap01
          |- ikono
          |- sounds
            |- fr
            |- de
          |- videos
  
Cette organisation reflete un scénario linéaire, mais rend complexe des scénarios composés avec de multiples branches selon un profil.

projet
  |- chapters
      |- concept01.yml
          - [scene01, scene04, ...]
      |- pratique02.yml
          - [scene02, scene04, ...]
      |- evaluation.yml
          - [scenes10-11 ...]
  |- scenes
      |- shared.yml
      |- scene01.yml
      |- scene04.yml
      |- scenes05-08.yml
      |- scenes10-11.yml
      ...

Les chapitres contiennent les liens vers les fichiers de scene. 
Implicite : si le fichier chapter ne contient pas de scenes, alors les chercher dans le dossier scenes

Une facilité permettrait de suffixer un fichier en .scene.yml pour signaler qu'il contient une scene, ou un tableau de scenes
dans ce cas, il ne comporte pas de prop stories ou autres

Un chapter peut incorporer un autre chapter, qui devient un sous chapitre.
Un chapter peut etre mergé avec un autre ? 
 - Préférer ici de la composition avec des regles de fusion  (in, not, ..) voir MongodB

un fichier scene peut contenir une ou plusieurs scenes contenant:
- [7] scene 
  - [6] stories
    - [5] persos
  - shared
    - [4] persos

- shared
  - [3] stories
    - [2] persos
  - [1] persos

- ~~shared~~ 

1. persosShared = heritage de persos résolu avec shared
2. heritage de persos avec persosShared et shared.persos
3. storiesShared = heritage de stories, construction avec [2], persosShared et shared
4. heritage de persos avec persosShared et shared.persos
5. heritage de persos avec [4], persosShared et shared.persos
6. heritage de stories, construction avec [5], storiesShared, persosShared et shared

stories et persos sont communs aux scenes du fichier. 
Il n'est pas évident de définir la portée de shared ici, sinon, la meme que stories et persos.
shared est défini au niveau supérieur, App, project ou chapter, dans un fichier shared.yml

le contenu de shared sera: 
- des définitions de styles pour des élements : blocs, lists...
- des layers 
- des jeux de pictos
- ...

stories = compile({file.stories, file.persos}, shared)

scenes.map(
  scene => {
    get cast (scene.stories, stories, shared) : story[]
    get entry (scene.stories, stories, shared) : story
    casting = [entry, cast].map(compile)
    return casting
  }
)
 
il manque ici clairement l'étape ou je récupère tous les persos d'une scene.
? La fonction compile ne devrait pas aller chercher les persos, mais opérer sur des scenes completes.
-> l'étape merge nécessite toute la chaine d'heritage ; elle se trouve dans transform-persos.
-> ou bien, rechercher tous les persos impliqués dans l'héritage, les passer à la scene, qui les fusionne ensuite ?

Comment opérer ?
Il faut remanier la suite des opérations :

L'entrée est la scene;
- conformation du cast
- regrouper tous les élements necessaires à la scène :
  - les stories,
  - les persos necessaires à chaque story,
  - les chaines d'héritage de chaque story ou perso.
- conformation des persos
- conformation des stories
- post-traitements
  - ajout d'actions
  - resoudre les valeurs dynamiques


## todo list tests.
quelle marche à suivre ?

1. tester dans shared les persos, dans et hors des stories 
2. variante avec un historique : prendre proto_bloc comme contenu de l'historique
3. tester dans scene persos dans/hors stories; historique += shared

note : récursivité. Une story pourra en référencer une autre, mais ne la contient pas ; la structure de la scene est flat : tous les persos sont déclarés au meme niveau dans le player. Pas besoin d'imbriquer des stories dans les autres, il suffit de les citer comme perso
Expliciter la descrption de l'incorporation d'une story dans une autre en extrapolant sur ce qui se fait dans une scene.

note : portée des ids
résoudre les noms lors d'instances multiples, particulièrement les slots. 
Nommer $.id  ? nommage implicite ? ici l'implicite pourrait etre ambigu si on veut se réferer plus tard à ce slot ailleurs. 

## Merge Stories
Scene.cast peut-il ajouter des stories shared directement, ou bien doit-il déclarer une stroy puis l'étendre ? -> revient au meme, donc facultatif. ajouter à la fin. 

Plus tard : une list peut-elle etre mergée ? quel intéret ? 

Regles de merge : 
- Les persos de la story sont prioritaires en cas de conflit de nom
- les props sont prioritaires
- les eventimes sont mergées :
  - si pas d'eventimes, utiliser l'héritage
  - name et startAt son proritaires
  - events est mergé. 
    - les events sont ajoutés par défaut, en cas de propriétés identiques :
    - pas de fusion sur les noms, un event de meme nom peut etre appelé plusieurs fois.
    - si un event à le meme nom et le meme départ, il est fusionné. les data sont concaténées.
    les datas ne sont pas typées, elles peuvent etre de toute nature. La fusion ne fonctionnera pas tout le temps. S'appuyer sur des cas concrets pour faire évoluer le traitement
  si possible, traitement récursif des events imbriqués


## Explorer un objet
explore : 
- si prop === string : pipapo
- si prop === object : 
	array ? map.explore
	object ? in.explore

### quelles données fournir ? 
metas de scene (id, entry)
metas de story (id, entry)
perso lui-meme : attention aux ref circulaires ! limiter à l'id ?
les slots ? -> slot est le content d'un perso
le perso pourrait aussi contenir des données qui serve à construire les instances , mais ne sont pas traitées ensuite
perso.data ?

scene : {id, entry, channel}
story : {id, entry}
perso : {id, content?}
data: any

### comment cibler un autre perso ? 
y-a-t'il une raison d'employer une variable lorsqu'on cible un slot ? 
La complexité actuelle, c'est le layer qui contient n slots, qu'il faut cibler = layer.id + slot.id 
peut-on faire plus simple ?

### comment traiter une expression ?  
exemple, je recois un index, j'ai besoin de renvoyer 'index + 1' 
les datas recues par la fonction peuvent comporter des méthodes à la place d'un tableau de données 
cela suppose que l'on ait identifié la structure de données à traiter

exemple pour le jeu : 

un tag : 'game' ou 'model: game' par exemple, envoie les données à un module de traitement. 
attention : il faut charger les modeles dans le jeu, mais le jeu peut etre relancé sans avoir à reconstruire la page ! 

Les persos qui servent de modeles sont chargés, puis générés à la demande au moment de l'exécution de la scene 
Le contexte est différent d'un mappage en finalisation du chargement de la scene. il partage l'application d'un template, mais ne le fait pas au meme moment.

Un modèle destiné à un module jeu ne doit pas etre taggé au chargement, il n'y à pas de sens à faire une application partielle. 
-> uniquement la partie template, le reste des traitements communs peut etre effectué ?
ou bien le modele, vu son emploi, n'estpas du tout traité au chargement. il pourra eventuellement bénéficier des fonctions de pré-traitement, à l'int"rieur du jeu.


## story : onmount
lancer une fonction lorsqu'une story est lancée.
permet d'identifier son root et de calculer son zoom
les stories n'ont pas de listen ou actions, aussi il faut créer un event en dehors de ce dispositif
- quand l'event décrit dans cast se produit, lancer la function onmount qui contient
		Scene.setStoryCast(story);
		Scene.activateZoom(story.id);


## Chapter
chapter est appelé par 
- le sommaire du  Project, 
- un autre chapitre
Chapter est appelé :
- par l'id du chapitre,
- par le path vers les ressources à charger 
- option, la scene à lire en premier
dans le sommaire, les chapitres sont désignés par 
- id,
- titre,
- path vers le dossier. Par convention, path peut etre déduit par l'id du chapitre
Dans le dossier du chapitre :
- lit dans index les fichiers à charger,
- un seul fichier à lire,
- ou un mix : par défaut un fichier, mais en en-tete optionnellement les fichiers à lier.

methodes :
init : 
  - charge les fichiers scene, 
  - les transforme,
  - charge les medias, en priorité celle de la scene courante
  - lorsque les medias sont chargés/ disponibles, indique que la scene peut commencer
  - liste les scènes dans l'ordre de lecture
start : lance la scene demandée
next: lance la scene suivante 
prec: lance la scene precedente
goto: lance la scene demandée
end : termine le chapitre

changement de scene
- dans le meme chapitre :
  - vérifier que les medias sont chargés
  - creer la scene
  - détruire la scene actuelle
  - lancer la nouvelle scene
- changer de chapitre
  - lancer un loader
  - chrger les ressources

> possible ?
cloner le node "app", pour maintenir l'affichage, pendant que la nouvelle scene se charge. La scene originale est perdue, les nodes originaux attachés à la scene aussi.
pas besoin de maintenir deux objets Scene

 
Les méthodes prec, next, goto sont appelées via des events
> les méthodes de fin de scene ou de chapitre pourraient etre des méthodes asynchrones

## chapter ne doit pas dépendre des srtatégies de chargement des scenes
chapter doit ignorer comment les scenes sont obtenues, puisqu'il sera possible de varier les approches selon l'application, ou meme au sein d'une meme app. 

La stratégie de chargement est choisie au niveau de l'app.  A précisier quend le besoin sera défini.


## Comment gérer les events d'une scene à l'autre ?
- plusieurs emitters : scene/chapter/app
  - celui en charge de la scene est re-crée à chaque fois.
  - comment appeler l'emitter chapter dans une scene ? -> il faut passer par des fonction relais, potentiellement compliqué
  - il existe la methode listenTo qui a cette fonction.


- un emitter unique :
  - interactions directes avec tous les composants de l'app
  - nettoyage complexe : il faut identifier tous les emitters , risque de fuites mémoire. emitter est disponible dans tout l'app, il n'y a pas de garantie qu'un event soit détruit 
  > créer une api par dessus emitter qui dispose automatiquement les events créés


## Project
project contient le sommaire et des parametres généraux

sommaire: tableau de chapitres
chapitre : 
- ordre
- id
- titre
- description
- vignette
- path : chemin d'accès au chapitre depuis le point d'entrée
- filter: condition d'apparition selon le profil
- can-play: condition d'accès au chapitre (profil, pré-requis, score...)
- scene entry : si pas renseigné, la premiere dans le tableau



parametres
- langue par défaut
- sous-titres : o/n
- langue des sous-titres par défaut
- profil: variable entrée par l'utilisateur
- datas-profil : données contextuelles au profil
