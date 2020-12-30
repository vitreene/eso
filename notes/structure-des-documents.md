
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
  - subtitles:
      content:
        when:
        - go:  'ref-text-01'
        - +2:  'ref-text-02'
        - +15: 'ref-text-03'
  - list:
    content: [ref1,ref2,ref3]
      when: go
      stagger: 0,25


strap:
 game: {when: {go: ''}}

```

## rejoindre le Shell
avec seulement quelques composants dédiés, on peu rapidement reproduire l'essentiel des présentations. Il faut

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
- fonctionne comme un extend

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