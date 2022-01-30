Librairie et apps

## Librairie

La librairie est chargée de la définition, la création, la mise à jour et l'affichage des composants sur la scène.
Elle comprend :

- la collection des composants
- la collection des contenus (sous réserve)
- les slots
- create()
  - conteneur commun
  - contenu :
    - slot
    - texte
    - image
    - html
    - texte enrichi
    - video
    - ...
- update()
  - gestion des classes (add, toggle, replace, delete)
  - styles
  - transitions
  - reslot
- onScene()
  Controle les entrées, les reslots, la réorganisation et les sorties des composants

Un système d'enregistrement permet de déclarer un type de contenu. Avec le render, ce sont les seules parties en contact avec la librairie d'affichage choisie (hyperHtml, sinuous...)

Un type de contenu accepte un objet de la propriété 'content'.
Un type de contenu pourrait accepter de faire transiter un composant comme le fait Slot.

Chaque composant est encadré par un tag (div par défaut) qui recoit les updates (classes, styles, etc.)

## Scene

- **id** : nom unique dans le chapitre / projet
- **title** / name : titre de la scene
- **entry** : story affichée avant le départ de la timeline ; sert de layout.
- **include**: tableau des straps utilisés
- **cast**

  - **story**
    - **startAt** : timing / label ; depart de la story
    - **root** : élément parent dans lequel est joué la story
      Cast est un tableau présentant l'ordre dans lequel sont lancées les stories.

  Il peut etre simplifié par une déclaration implicite de ses propriétés dans le système de fichiers :

  - si absent, utiliser toutes les stories de la scene;
  - si root n'est pas défini, utiliser un id convenu dans le layout
  - si startAt n'est pas défini, utiliser la fin de la story précédente comme départ de la suivante.

### Story

- **id** : nom unique dans la scene
- **alias** / _channel_ : par defaut egal à id ; sinon ecoute tous les events de la référence donnée.
  alias est différent de l'id lorsque la story sert de layout à la scène, par exemple.
- **stage** : cadre virtuel de référence de la story, dans lequel les coordonnées sont calculées
  Quand une story est insérée dans un bloc, les proportions ne coincident pas forcément. Stage définit un bloc virtuel pour calculer les coordonnées réelles.
- **extends** : héritage des propriétés d'un composant préexistant qu'il instancie. Voir heritage.
- **ignore**: si extends, tableau des persos à ne pas intégrer
- **layout** / _entry_ : tableau de persos qui doivent etre affichés à l'initialisation de la story.
  Cette propriété suit la meme logique de définition qu'au niveau de la scene
- **eventimes** : tableau des correspondances timing/action
- **persos**: tableau des composants affichés

**alias / channel** _(à renommer en: alias)_
Toute story employée comme layout perd son id dans la timeline, qui est redéfini sur son parent
La story qui sert de layout pourrait voir ses events associés à la scene, evitant l'emploi de alias
garder alias pour un cas d'usage pas encore rencontré
Channel est employé par la timeLine, cette propriété pourrait etre associée à l'id/alias et suprimée

**entry / layout** _(à renommer en: layout)_
Layout semble un nom plus explicite pour désigner le ou les éléments qui soutient tous les autres, et qui doit etre chargé avant le départ de la timeline.
Layout est un tableau ou les élements sont chargés dans l'ordre d'index.

#### Eventimes

eventimes est une map établissant une correspondance entre un timing/label et un event.
Le timing est toujours relatif au départ de la story
Des maps d'events peuvent etre imbriquées ; leur point de départ est l'event parent

Le format standard :

- propriété : **timing** / **label** -> résolu en timing
- valeur:
  - **channel** : vers ou l'event est envoyé - la story par défaut
  - **name**: le nom de l'évent à emettre
  - **data**: des données ajoutées à l'event qui les emettra
    La valeur peut etre un tableau en cas d'emission simultanée.

Le format de fichier autorise plusieurs variantes d'écriture implicites. Notamment, des raccourcis permettent de nommer un event à l'identique d'une action, dans le contexte de la story ; dans ce cas, la correspondance est {[timing]: action}

**De manière générale, les résolutions implicites permettent de simplifier le parametrage des fichiers, sans entraver le besoin de résoudre des cas spécifiques**

#### Persos

Persos est un tableau d'objets définis par un type : bloc, image, list, button, sprite... correspondant à un composant ou un type de contenu, pour lequel un constructeur existe.
Leur propriétés sont communues :

- **id**: nom unique
- **extends** : héritage des propriétés d'un composant préexistant qu'il instancie. Voir heritage.

- **initial** : propriétés envoyées au contructeur du composant.

- **listen** : tableau des correspondances entre events et actions

  - **channel**: par défaut, la story
  - **event**: event qu'écoute le perso
  - **action** : objet à envoyer à l'eventEmitter
    Si listen n'existe pas, les noms d'action sont implicitement employés à la place

- **emit** : evenements associé au composant (ex: 'mousedown').
  Chaque emit emet un evenement adressé à un **strap** avec les données associées

- **actions** : tableau d'updates

**initial**

- **content**: selon le type de composant
- **style**
- **className**
- **classStyle** : styles transformés en classes dynamiquement
- **dimensions** : width, height, ratio

**update** est commun à initial, avec en plus :

- **move**: id du nouveau parent du composant. génère une transition
- **transition**: objet ou ou tableau d'objets
  - [string] pour une transition prédéfinie
    ou
  - **to** : objet contenant des propriétés styles acceptant des transitions
  - **duration**
  - **repeat**
  - _yoyo_

**content**

- type **bloc** | text :

  - **texte** | **nombre**
    ou
  - **refLang** : groupe ou trouver la référence: langue | sous-titre ...
  - **lang** : langue ou trouver la ref : fr | rn |de ...
  - **ref**: clé de la ressource texte / texte enrichi
  - **effect** : micro-effets d'animation définis par un nom
    de toutes autres conventions peuvent etre établies.

- type **image**

  - **src**: chemin de l'image
  - **fit** cover | contains

- type **sprite**

  - chemin

- type **sound**
  - chemin

### straps

Fonctions utilisant les events, renvoie des données, pas un composant
gère la logique des composants
Définis au niveau de la scene

### Timeline

Timeline fonctionne avec Seek, Clock et eventEmitter, qu'il pourrait intégrer

#### Tracks : timeline multiples par scene

Un track représente une timeline active.
un track regroupe des events qui peuvent etre activés ou desactivés ensemble.
lorsque la scène est mise en pause, les evenements liés à play sont désactivés, ceux liés à la pause sont disponibles.
Cela permet par exemple d'activer le clignotement d'un bouton, de jouer une animation, d'activer l'aide, etc.

**Règles des tracks**
Certains tracks sont exclusifs, ex: le track fr et ne peuvent pas fonctionner ensemble.
Le track pause désactive tous les autres tracks de langue
Le track edit se superpose au track actif : l'element edit est activé, qui se superpose à l'objet selectionné, avec des fonctions dédiées
Le track projet - s'il existe - reste toujours actif ( scene suivante / précédente / sommaire)

Ces regles sont établies au niveau supérieur de la timeline :

- over:['edit']
- oneOf: ['fr', 'de', 'pause']
- always: ['app']
  des mehodes activeTrack et desactivateTrack permettent de gérer manuellement ces états

Chaque track contient une collection de timeline segmentées

- par story
- scene
- straps
- telco
- app
  ...

note : attention, les tracks ne sont pas forcément efficaces pour activer par exemple un mode edit. Ce mode désactive les intéractions des composants pour les remplacer par celles de l'éditeur. La timeline n'est pas sollicitée à priori, sauf dans l'inscription des clicks comme events.
-> il pourrait etre rajouté une div au dessus de la scene qui vient bloquer tous les clicks, tout en permettant d'identifier quel composant se trouve sous le pointeur
Comme pour la pause, la timeline ne servirait qu'à afficher certains composants qui ne deviennent actifs qu'à ce moment. Est-ce adapté ?
Par ailleurs, revient souvent l'idée des guards - idem state machine -

#### Structure d'une timeline

- channel
  - timing : [eventName]

#### Ajouter des events

- si le channel n'existe pas, le créer
- pour chaque event ajouté :
  - calculer le timing en valeur absolue
  - si c'est un label, rechercher le timing correspondant et le remplacer
  - s'il n'est pas trouvé, consigner l'event en suspens
  - pour chaque label résolu, l'ajouter à la table de correspondance et résoudre les events en suspens
  - si l'event contient des datas, les consigner avec la ref de l'event

**labels** alias d'un temps à resoudre
Les labels permettent de découpler un événement du timing ou il doit s'exécuter.
Cela permet d'associer une action à des timing différents :

- selon la langue, une action synchonisée sur la voix se déclenchera à un moment différent.
- simplifie la mise au point d'une cascade d'événements

#### Events dynamiques

Des events ayant lieu au runtime sont eux aussi enregistrés sur un channel dédié.
Certains events dynamiques peuvent ne pas etre enregistrés : les étapes d'un déplacement à la souris, par exemple. Seul le dernier emplacement au relachement le sera.
Un event peut déclencher une cascade : par exemple un click provoque une animation; celle-ci doit pouvoir etre interrompue si l'on clique une seconde fois.
A l'inverse, un click ne sera pas enregistré tant qu'une animation n'est pas terminée.
le click et / ou la cascade peuvent ne pas etre conservés. Ils ne seront pas activés si l'on effectue une pause puis un seek
Une autre catégorie d'events dynamiques sont ceux générés par les straps
Aussi, les events liées aux transitions (complete, repeat...)

**Before, After**
Des événements peuvent se placer avant et après le déroulé de la scène.
L'événement start est relativement simple, celui de fin est moins évident.
Un événement 'end-scene' peut avoir lieu avant la fin des animations.
Par défaut, il se situe à la fin du dernier media sound. il est appelé pour déclencher l'autorisation de passer à la page suivante, par exemple.
La scene est formellement terminée lorsqu'il ne reste plus events à lire sur la timeline.
Attention, les tracks "pause" ou "edit" n'on pas en soi de fin

#### Seek : un middleware avec en entrée un timing, doit renvoyer un état

Seek va utiliser la timeline pour caclculer l'état de la scène à l'instant T
entrées : stories - timeline
Pour chaque story :

- recupérer l'ensemble des actions jouées jusqu'à T.
- calculer l'apparence :
  - traiter classes, contenus, et attributs.
  - pour chaque transition ou move :
    - la transition est-elle terminée -> ajouter 'to' ou placer l'élément
    - sinon, ajouter la transition et calculer une valeur progress, en tenant compte des événements cycliques (repeat, yoyo...)

Certaines situations sont complexes à calculer : un move, lorsque les layouts sont eux-memes en mouvement par exemple.
Pour cela, un element doit pouvoir calculer sa propre situation absolue (rotation, echelle, position ) si ses parents sont eux-memes déplacés. Le DOM ne le permet pas, les positions doivent etre inscrites dans chaque perso.
Note :

- position absolue sur la scene, quelle que soit sa position dans un layout
- point de référence d'un composant

### clock

Clock est est la boucle qui incrémente un chronometre et lance les evenements associés au timing.

La timeline est construite comme un eventEmitter, il serait possible de fusionner ces roles.

### eventEmitter

- filtrage par type, par canal
  La timeline pourrait fonctionner comme eventEmitter et recupérer toutes les actions

### formats de fichier

Dans sa plus simple expression, le format de fichier est identique au format necessaire aux composants {id, initial, listen, actions, emit}
Il est possible de générer automatiquement :

- extends : héritage des propriétés d'un composant ou d'une story
- génération de lots
- ajouts d'actions : play, pause, complete...
- privilégier déclarations implicites et presets

Des surcouches liés à des formats différents permettent de prendre en compte :

- expression orientée timeline (au temps X, fais ceci..)
- legacy : compatibilité shell

**heritage**
Les stories et les persos peuvent hériter des caractéristiques d'autres composants.
Eux-meme peuvent hériter d'autres composants selon une chaine qui remonte au composant racine.
Chaque propriété s'hérite soit par remplacement, soit par fusion des valeurs comme pour les styles par exemple.
La propriété _ignore_ liste les composants à ne pas prendre en compte
Les composants destinés à etre partages peuvent se trouver dans la scene meme, ou dans la défintiion du chapitre, ou du projet meme.
Cela permet de construire un ensemble cohérents d'objets en evitant au maximum la répétition
