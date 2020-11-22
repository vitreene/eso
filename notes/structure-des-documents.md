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
