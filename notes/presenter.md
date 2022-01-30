# Présenter Veso

## Le point de départ

Après quelques mois d'usage du Shell, la question : _et comment je ferai si c'était moi ?_

Plus recemment :
ce projet rencontre un projet plus ancien - _diyapo_ - qui utilise aussi un affichage numérique.
Ce projet, eso, puis _adyu_, se présente commeun framework capable de s'adapter à ces deux projets : type shell, et diyapo

- quelles motivations
- à quels besoins répond-il ?
- que fait-il de mieux que ce qui existe ?
- quels arguments à développer selon le public :

  - cp

    - composition de projets, sur mesure
    - multilangue en first-class
    - plus intéractif

  - dev

    - ajouts et evolutions simplifiées
    - systeme de messages
    - séparation du coeur et du projet
    - imports multiples

  - integrateur

    - architecture ouverte,
    - personnalisation
    - recupérer des parties d'autres projets

  - l'interpréteur fait l'essaentiel du boulot. Le coeur reste réduit, peu de fonctions sur-mesure.
  - travailler le code d'édition pour une expressivité maximale. Faire beaucoup en disant peu car beaucoup d'implicite. Expliciter le détail au besoin.
  - orienter l'expressivité sur la narration. "je fais ceci, puis cela, et s'il arrive ça je fais çi."

  ***

- démos :
  - un exemple différent d'un e-learning, pour le distinguer du shell.

todo: décrire le fonctionnement de l'app

## Composants

#### hierarchie

- app
- project
- chapter
- scene
- story
- perso

#### **Persos**: composant élémentaire

- gère un type de contenu
  - texte
  - Node
  - image
  - slot
  - media (son / video)

4 propriétés pricipales :

- initial : décrit le l'apparence du composant
- actions : décrit les modifications du composant
- listen : events auxquels réagit le composant
- emit : events générés par le composant

**initial** et **actions** gerent les propriétés :

- style : css inline
- classStyle : transformé en class
- className : liste de class ; des modifiers ajoutent, retirent, remplacent.
- content
- dimensions: width, height, ratio

**actions** possede en plus :

- move : déplace un élément d'un slot à l'autre
- transition : {from, to, duration} []

**listen** : tableau de correspondances entre events et actions.
par défaut, écoute les events de la story auquel le perso appartient, mais peut aussi un event d'une autre origine avec la prop channel

**emit** : associe un type d'evenement (click, drag...) avec un listener et un objet data.

#### **Strap**

Les persos n'ont pas de logique interne propre. Si on a besoin d'un composant logique, il faut utiliser un strap.

Un Strap est une fonction qui réagit à des events, comme les Persos, recoit des données, les transforme ou les crée, et emet des events avec ces données.
Exemples :

- gérer un effet de bascule d'un bouton,
- gérer le déplacement d'un composant
- compteur, timer...

#### **Story** : groupe de Persos

- liste de persos
- eventimes : map [time, label, [channel]]. Les events ajoutés à la timeline générale
- stage: dimensions du cadre virtuel dans lequel la story est construite. les dimensions des persos sont calculé en fonction.
- pour etre jouée, une story doit etre associée à un Node parent, choisi dans les slots disponibles.
- un event est associé au lancement de la story, les eventimes sont caclulés relativement à ce lancement.
- Plusieurs stories peuvent etre jouées simultanément, et peuvent partager des intéractions

#### **Scene**

- une scene à la fois
- charge et intitialise les stories
- pilote le déroulement de l'animation
- initialise Clock et la Timeline
- assigne root et start aux stories

  **entry** : une story est désignée pour etre affichée avant le début de la séquence. Elle sert de cadre dans lequel se déroule la scene.
  Exemple : le fond de scene par défaut comprend une zone pour l'animation et une autre pour la télécommande (play/pause), qui est elle-meme une story.

**Initialisation de la scene**

- creation des persos
- initialisation des Straps
- création des fonctions de réponse pour les écouteurs.
  Crée le lien entre les actions et l'update du composant.
- assignation des root / start aux stories
- lancement de la séquence.

#### **Chapter**

- charge les medias avant de lancer la scene
- gere l'enchainement des scenes

#### **Projet**

- liste des resources
- préférences / parametres
- format de fichier
- organisation des dossiers

#### **App**

initialisation, réglages généraux.

## Format de données

Les données en entrée de la scene décrivent les composants et leurs updates ;
elles ont été préparées pour ne pas avoir à etre transformées au runtime.
L'expressivité est résolue au niveau du format de fichier.

- le corps du format décrit chaque composant selon les besoins initiaux (id/initial/actions/listen/emit)
  Le format de fichier permet d'utiliser toutes les propriétés du moteur, et ajoute plusieurs couches facilitant l'écriture.
  Des faciliteurs permettent d'optimer le code à rédiger :
- héritage : la propriété **extend** permet de se baser sur un perso ou une story existante pour créer une instance modifiée.
- implicite : les données absentes sont remplacées par des valeurs par défaut ; les id sont générés automatiquement.
  exemple : Si root et start d'une story n'est pas passée, alors les stories s'enchainent l'une après l'autre sur la scene principale.

- Des méthodes facilitent l'écriture :
  - LIST : boucle sur une liste de propriétés pour créer une suite de composants similaires
    ex. list : { tag: 'li', extends: 'item', data: [ {content: "toto"}, {content: "titi"} ]
  - WHEN : décrit la progression d'un perso ou d'une de ses propriétés dans le temps.
    ex. content: { when: {1000: 'toto', 2000: 'titi' } }

## Events

Les composants sont mis à jour grace à un système emetteur/recepteur.
Les persos écoutent les événements auxquels ils ont souscrit.
un evenement à pour signature (nom_event, fn-> update )

- **nom_event** peut etre une string ou un tableau. un tableau permet de créer des chaines (ANIM, TELCO, STRAP...) qui ciblent un type de composant
- la **fonction** renvoie les données d'update. Des données dynamiques peuvent etre ajoutées, par exemple pour renvoyer la position de la souris.
  par défaut, un perso possède un appel vide avec son id, pour lui adresser un update exclusif.

Cependant, le modèle est concu pour ne pas restreindre qui peut écouter un emetteur. Par exemple, un déplacement de souris sera écouté par le perso que l'on eut déplacer, mais aussi par le perso chargé d'afficher ces corrdonnées. Les deux accedent à la meme info, et l'utilisent différemment.

Si les données doivent etre transformées, par exemple pour transformer les coordonnées de la souris en valeurs de couleur, i faut passer par un autre strap chargé d'effectuer la conversion puis de le transmettre au perso. Ce perso n'écoutera pas la position souris, mais le convertisseur.

Toutes les parties de l'application peuvent écouter et emettre des events :

- TELCO : la télécommande gérée par la Scene : play/pause, seek…
- NAVIGATE : géré par chapter pour passer d'une page à l'autre, retourner
  au sommaire...
- APP pour lancer/quitter le projet.
- etc.

Les events d'un persos sont définis par les propriétés listen et actions.
Sont ajoutés d'office les évenements :

- fin de story
- "self"
- play/pause

Le système d'events constitue l'essentiel de l'api. Cela necessite de pouvoir acceder à emitter.

## Slots

Dans le projet, la capacité des persos à contenir un type de contenu est plus rigide que ce que permet HTML. En particulier, un composant doit etre du type Slot pour pouvoir etre le conteneur d'un autre composant.

Un slot peut contenir plusieurs composants. la propriété move des actions permet de passer d'un slot à l'autre

#### Langues

Un texte peut etre passé tel quel - raw - , ou bien par référence. Dans ce cas, il est possible de signaler sa langue, ainsi que son régistre (texte courant, sous-titre...). Les parametres de langue du régistre sont définis au niveau du projet.
Il est possible de définir autant de registres que necessaire.

#### Micro-animations

Les textes peuvent etre animés dans une transition, en utilisant des animations pré-concues. S'il est possible d'ajouter de nouvelles transisitons à l'application, celles-ci ne peuvent etre directement conçues via le fichier de données.
