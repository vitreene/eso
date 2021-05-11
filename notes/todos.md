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

- [x] ? Une story ne peut apparaitre qu'une seule fois dans une scene -> sauf si isolation des events et mecanisme d'events partagés
- [x] ? Une story peut-elle en contenir une autre, ou bien une scene peut en contenir une autre ?

> **Une story peut etre instanciée dans plusieurs scene, ou dans la meme scene ; il lui faut un id unique.**

#### instanciation d'une story

- [x] Dans le contexte du shell, peu utile. Mais pour vitreene ?

- [x] Une story pourrait-elle néanmoins apparaitre une fois dans deux scenes imbriquées dans une troisième ?

- [x] Comment isoler une story pour pouvoir l'instancier ?
      Distinguer les composants qui appartiennent à Story et à Scene

il faut :

#### root

- [x] Le point d'entrée est unique et distinct. Il dépend du parent.

#### zoom et cadre

La story se joue dans un cadre virtuel, centré dans le slot où il est monté.

- [x] Le zoom est calculé par rapport au parent, mais il n'est recalculé qu'en cas de resize global de la fenetre
      amélioration possible, un listener sur le parent ; attention à des boucles infinies si l'enfant modifie la taille du parent.

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
un workspace _Project_ destiné à y placer les contenus

- medias
- yaml
  - summaries
  - chapters
  - scenes
  - stories
  - config
- css

### micro-animation sur les textes

- [ ] effets nommés

- [x] passer les refs dans un fichier secondaire

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

la création de scene devient synchrone.

> **NON** : les fichiers yaml pourraient ne servir qu'en phase de développement, un fichier json serait généré pour l'exé. Celui-ci reste accessible et modifiable.

- [x] Le pré-chargment des images peut avoi lieu après chargement et analyse des json, et avant le début de la scene.

Après chargement des images de la première scene, la scene est lancée, le reste se fait en background. Idéalement, chaque scene ne peut démarrer que si les medias ont été chargés.

### play/pause controle les animations par un update régulier

### timeline

- enregistrer les animations
- garder l'état des straps

## TODO janvier 2021

### Story

### Composant Audio

- events on Complete
- pilotage par telco
  Le composant audio pourrait etre un Strap, dans la mesure ou il n'a pas necessairement besoin de rendre un tag html
- il est apporteur d'eventimes
- les eventimes peuvent varier selon la langue, ils doivent etre neutralisés ou effacés au besoin
- tenter d'implementer un changement de langue à la volée

  > trop complexe, un changement dans l'ordre des events peut perturber l'animation en cours

avec la timeline et les levels une animation peut se mattre à jour en changeant de langue

- un canal audio doit etre ouvert à la première intéraction, et ne pas disparaitre au changement de page.
  Le strap Audio doit manager l'ajout et le retrait de canaux ainsi que l'activation des eventimes liés.

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

- [x] **Transform yaml** : dans les stories, extends ne fonctionne pas avec les persos externes.
      Revoir le système de passes :
- objet 'proto', du meme niveau que scene, dans lesquels seront placés tous les prototypes ET éléments partagés. Les éléments non utilisés sont effacés.
- un proto peut etre défini à l'intérieur d'une story, sa portée est la story, en cas de conflit de nom, il est prioritaire.
- un élément défini dans 'proto' n'a pas besoin d'etre défini comme proto.
- proto contient des persos, et des stories.
- d'autres éléments pourraient etre ajoutés : eventimes, medias ?
- les éléments de proto comportant des extends sont résolus avant d'etre employés dans les stories.
- un extend dans proto ne peut pas se référer à à un proto dans une story.

- chaine d'héritage :

  - proto du type de perso
  - persos dans proto
  - persos dans proto/story
  - proto dans scene/story
  - persos dans scene/story

- ~~**veso/ "pre" : preparation des modifications**~~
- [x] **Transition**
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

**Plus tard**

- [x] Poussant la logique jusqu'au bout, veso pourrait se delester de toute function de transformation, qui seraient déléguées dans un module externe.

veso ne garderait que le state et son historique, la méthode de rendu, la methode d'application des transformation.

Les fonctions de transformation seraient pures, et n'auraient pas besoin d'etre instanciées.

**etats du composant**

l'état du composant est incrémental, ses évolutions s'ajoutent au fur et à mesure du récit.

il faudrait pouvoir nommer des états et faire en sorte que l'on puisse passer de l'un à l'autre.

- [x] Pour faire des transitions correctes, il faut connaitre toutes les propriétés que l'on va modifier sur la vie du perso.

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

Sur l'exemple play/pause, cela permet d'inverser le role de play et pause, les persos reagissent à story.play / story.pause, la story transforme scene.play en story.pause par exemple

~~**transitions comme fonction statique de Eso**~~

Les fonctions statiques ne sont pas spécialement utiles, les retirer au profit d'appels de fonction classiques

- [x] Eso serait initialisé avec emitter
      ex: createEso(emiter) {return class Eso ...}
- [x] Garder transitions du coté d'eso, car pas spécifique à app mais plutot à ce module
      transitions est géré par l'app.
- [x] Transitions intégre reslot qui est un type de transition
- [ ] transitions gagnera au passage un controle des transitions
- [x] supprimer 'pre' du corps d'Eso
- [x] emitter n'est plus necessaire à l'init du perso.
      Emitter est identique pour toutes les instances d'Eso

# To do 07/03/21

1. **terminer une scene :**

- retirer les events
- detruire les nodes / persos,
- events vers telco :
  - scene precedente / suivante / rejouer / sommaire
- event end-scene en fin de lecture dans un eventime, ou interrompu
- enregistrer le statut de la scene :
  - durée de lecture
  - interrompu / partiel
  - autres : resultat d'un questionnaire, score...
- animation de retrait, d'attente du chargement, d'entrée

2. **composant sound**

- sans element audio ?
- recoit les events :
  - play, pause, seek, tick
  - start-sound
- émet : end-sound
  L'element audio est disponible au chargement de la page, ne disparait pas en terminant une scene, se lance à la première intéraction
- utilise des canaux, permettant de jouer plusieurs sons en meme temps
- est conçu comme un strap

3. **revoir slots et layers**

revoir ces concepts :

- Slot est une possibilité de content, comme text ou image
- l'id du Slot est celui du perso : un Slot par perso.
- Layer n'est plus un composant à part
- Layer devient List : un Bloc conteneur et une liste de Bloc slots.
  La List est générée par une boucle qui lit les descriptions de chaque slot
  Chaque Slot etant un Perso, il accepte des actions

```yaml
  *LIST
    id: list
    initial: {className: grid-list}
    slots:
      - id: *MAIN
          initial: { classStyle: {display: grid, grid-column: 1, overflow: hidden} }
      - id: *TC
          initial: { classStyle: {display: grid, grid-column: 2} }
      - for:
          count: 5
          offset: 2
          id: ${perso.id}_slot_${count}
          nature: *BLOC
          initial: { classStyle: {display: grid, grid-column: '${count}' } }
```

la propriété slot est un tableau qui accepte deux types d'objets :

- une description de Perso
- for, qui permet de créer une série de Persos :

  - count: nombre de Persos à créer
  - offset: nombre de départ pour count. si offset est une lettre, suivre l'ordre alphabetique
  - nature : type de Perso généré
  - initial, actions, listen, emit sont disponibles

  List doit etre exécuté tot dans le parsage du fichier

  > note : d'autres structures que for sont-elles pertinentes dans le fichier de construction, notamment les conditions if/else ou switch ?

Par exemple, construire des persos en fonction d'une variable de personnalisation
ou bien choisir un contenu en fonction d'une valeur.
Ceci pourrait etre obtenu simplement par une action,

- en associant un event à la variable,
- en utilisant les datas d'un eventime
  ou bien en utilisant les substitutions ${data.xx}

4. **Apps : shell ou vitreene, des spécificités**

vitreene presente des sequences composées d'au maximum 12 diapos, chaque diapo peut contenir à son tour une séquence.
Une diapo contient une animation d'entrée, une d'attente, une de sortie ;
Une diapo prend fin au bout d'un certain délai, ou lorsque chaque partie à émis une event de fin.
une séquence peut boucler sur elle-meme un certain nombre de fois ;
une série de séquences peut se succéder en alternance.

La logique est distincte du shell ; cependant, Scene devrait pouvoir jouer ces deux types sans modifications exclusives

5. **créer une nouvelle démo**

La version "App22-inception" est une performance d'un stress-test illisible, qui ne montre seulement que l'on peut animer une vingtaine d'éléments à la fois. La réaction sera : à quoi bon ?

Pour présenter le potentiel du projet, je dois aussi montrer ce qu'il n'est pas, ou pas encore : une alternative au shell.

Le shell est une app complete, il y aura toujours des fonctions manquantes sur veso, que je ne compte pas développer dans mon coin.

Il est judicieux dans ce cas de proposer une démo qui colle plutot à vitreene, par exemple une affiche dynamique du menu d'un restaurant.

La scene doit mettre en valeur les qualités du projet :

- multi-stories,
- héritage,
- zooms différenciés
- animations : interpolations de couleur, size image...
- scene en boucle : presente indéfiniment plusieurs carousels faits de suites de stories. un bouton permet de terminer la scene.

- carousel de stories. Dans le contexte de vitreene, la timeline n'a pas la meme importance que le shell.
  Une story est jouée par une suite d'eventimes. ces eventimes doivent pouvoir etre soit réinitialisés, soit rajoutés à la timeline pour une nouvelle exécution. Un event déclencherait un nouveau départ de la story

6.  **ordre des composants**

Lorsque un élément se trouve dans un slot occupé, il prend spontanément la place haute ; il faudrait convenir d'un ordre fixe :

- par un nombre,
- par un mot-clé : front, back...
  "front" voudrait dire : "reste devant quel que soit les autres éléments qui viendraient après". si deux éléments partagent le meme mot-clé, c'est l'ordre d'apparition qui est retenu ( le dernier est le plus important) ou bien, la dernière action (cas actuel)
  Distinguer "front-permanent" de "front" qui dirait : "reste toujours devant" vs "passe devant cette fois-ci"

Est-ce que l'ordre d'écriture prime ?

- oui, mais en mode maitrisé : attribution d'un numéro d'ordre qui sert tout le long de la vie du composant
- surchargé par l'attribution d'un numéro d'ordre, dans une action (dans initial, il n'y a pas de placement)
  un changement d'ordre, à l'intérieur d'un meme slot, entraine une transition avec les autres éléments ! en option, désactiver les autres mouvements
  exemple : dans le jeu "devinez le mot", les cartes posées dans le sabot ne devraient pas bouger lorsque l'une d'entre elles est manipulée.
  -> une fonction permet de passer d'une position statique à une absolute, en laissant les éléments en place.

le calcul de l'ordre doit se faire dans updateComponent

7. **résoudre les id des instances**

- [x] 8. **ignore :** signifier que l'on ne veut pas d'un élément lorsqu'on instancie une story

Le cas se présente où je ne veux pas d'une image dans une variante d'animation. Il suffit actuellement de la redéfinir, en lui retirant ses actions. Une méthode plus explicite serait bienvenue :
persos: - ignore : ['id1', 'id2', ...]

est-ce que cette propriété ignore pourrait etre employée dans un perso pour retirer des listen, emit ou actions ?

- [x] 9. revoir les transitions
     les 'actions' deviennent des 'états' : on peut passer d'un état à l'autre par interpolation, mais sans cumul des états successifs. Cela correspond mieux au résultat que l'on peut attendre d'un changement d'état.

permettre l'héritage lorsque l'on crée une action ?
(garder le nom d'actions pour le moment)

a quoi cela servirait : plusieurs actions donnent le meme rendu à un perso, mais à des positions différentes.
On pourrait imaginer deux actions successives ou simultanées, mais c'est assez lourd ?

Il serait difficile de déclarer ne pas vouloir d'interpolation sur certains résultats et pas d'autres.
Peut-on dupliquer une action venant d'un autre perso ? pas pour le moment, voir si cela a un intéret ?

les états peuvent etre partiellement précalculés, si l'on connait les valeurs de départ à utiliser.

- au plus simple, il faut déclarer une valeur de départ à chaque propriété interpolée;
- elle peuvent etre déduites des différentes parties ou dess styles sont définis
- il y a des valeurs courantes par défaut.

Les valeurs qui échappent à la détection :

- le valeurs de position et dimensions qui sont calculés au rendu,
- des valeurs définies dans des feuilles de style

pour les positions :

- move est dynamique,
- les valeurs unitless aussi
  c'est déjà pris en compte.

si une propriété n'a pas été déclarée, la rechercher au premier paint ?
ou appliquer une valeur par défaut ? laquelle ?
procédure :

- rechercher toutes les propriétés qui vont etre employées par les transitions
- pour chaque action qui comporte une transition, ajouter un objet 'to' aux propriétés identiques et qui décrit l'état final du Perso après cette action.
  pour chaque état, identifier les bonnes valeurs
- commencer par to dans l'état initial, puis duplquer l'objet en modifiant les valeurs interpolées
- comment chercher des valeurs qui n'ont pas été définies dans initial ?

10. **compléter les transitions**

- [x] a. traiter dimensions en dehors de Eso, supprimer \_pre
- b. accepter des durations distinctes par propriété -> tableau de transitions
- c. tween : repeat, yoyo : faut-il les traiter au niveau du tween, ou bien au niveau des eventimes ?

## Content : une classe pour gérer les contenus ?

a l'exception du composant img, tous les autres composants simples ont des caractéristiques communes, seul le contenu les distingue.
Eso contient meme la gestion des attributs et des events applicables aux inputs.

[x] en ajoutant slot aux types de contenus, on peut gérer l'essentiel des besoins d'affichage.

- text : accepte une string ou un objet.

  - String est un raccourci pour un type de contenu.
    Un réglage au niveau du projet (/ scene / story) permet de régler la préférence : s'agit-il d'un contenu ou d'une référence
  - objet :
    { lang: fr, ref: sous-titre, key: txt01, effect: fade }
    { text: c’est fini, effect: letters-top-down }
    - ref: groupe dans lequel rechercher la clé. ex: sous-titre, langue
    - key: clé de la string
    - isHtml : un flag pour signaler un contenu riche (ou bien, tout contenu est sanitusé par défaut ?)
    - effect : effet de transition d'un contenu à l'autre.

- image :
  ce composant fonctionne différemment des autres, à garder à part

  - src: lien vers l'image
  - fit: cover / contains

- sprite :

  - src
  - dimensions

- slot

## List un composant pour ramplacer Layer

list doit générer des blocs avec une slot comme contenu.
Dans un premier temps, List pourrait désigner un composant contenu un slot.

### slot: propriétés

faut-il définir les propriétés de positionnement dans slot, ou directement dans className ?
(align et justify items) => moins magique de les passer par les classes css
Réglage d'empilement des contenus:

- seat : cote à cote, horizontal ou vertical. Autre nom : row et column
- stack : empilement les uns sur les autres -> position: absolute
- static : ignorer un pré-positionnement

### redéfinir move, de nouvelles propriétés

move :

- to: id du slot
- story: par défaut, slot est recherché soit dans la story, soit dans entry. préciser ici le domaine de recherche (facultatif)
- order:
  - index : nombre, 0 est le premier node de la liste, donc le plus éloigné
  - mot-clé: 'first' 'last', pour garder l'élément en tete ou queue de liste.
    si plusieurs éléments ont le meme mot-clé, ils sont rangés dans l'ordre d'arrivée
    Order est passé à slot pour permettre à Slot de calculer les positions de chaque item dans le slot
    Les items sont positionnée en absolute, avec décalage en letfy et top.

story.entry -> scene.entry pas concerné, les stories sont toujours uniques
move
name
content
emit mousedown data

dresser la liste des id par story,
(chercher les slots ne suffit pas, il peut y avoir d'autres recherches)
preciser quelle story est l'entry
lorsque un id est demandé:

- chercher dans sa propre story,
- puis dans entry,
- si toujours pas trouvé, chercher dans les autres stories

  - si un seul trouvé -> ok
  - si plusieurs, warning / error ?
    -> il vaut mieux une erreur qu'un comportement innatendu plus difficile à résoudre

  placer la fonction après merge, avant les subtitutions de variables
  après la collecte des id, ceux-ci sont remplacés par les items complets
  utiliser un point comme jointure (paramétrable) : story.perso

dans action / move : si move est un objet, la propriété story/layer ? sera utiliser pltot que la découverte de la story. remplacer l'id, puis supprimer la prop layer/story

story.entry pourrait accepter un tableau de tuples : [persoId : slotId]
entry permet de placer les élements de cadre en tout premier, ils pourraient etre distribués plus finement

todos 06/05/21

- composant et saisie sound

  - play/pause

- play/pause comme action sur les persos
- telco devant update composant
- retrait control animations

- timeline

  - keyframes des persos
    - actions
    - transitions
      - to
      - repeat, yoyo

- seek

levels

- pause
- langues
- sommaire
- aide

Edit
