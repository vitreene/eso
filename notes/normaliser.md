# Normalisation

La normalisation consiste à adapter les valeurs d'échelle et de position d'un composant par rapport à un référent commun.
Le référent par défaut est le cadre de la scène - le viewport.
Chaque composant doit posséder ces informations, ou etre capable de les reconstituer à la demande.
Par exemple, un composant ayant subi une rotation peut etre placé dans un autre composant ayant lui meme une valeur d'echelle et une rotation propre.

Le DOM ne permet pas de calculer à coup sur la rotation absolue par rapport au référent : il existe plusieurs façons de générer une rotation par transformation (matrix, rotate...).
Dans un environnement controlé par contre, ces infos peuvent etre enregistrées de façon à les récupérer aisément.

Les contraintes :

- le composant doit connaitre son parent. il n'était pas prévu à la base du projet de le faire.
- pour simplifier, ne pas tenir compte de valeurs extérieures issues de classes CSS (utiliser une déclaration normée dans classStyle par exemple)
- seules les valeurs unitless seront normalisées. Les autres sont indépendantes du calcul d'échelle.

L'objectif serait de pouvoir connaitre la position dans la scene de chaque élément, indépendamment de son placement dans le DOM ni de son ancrage (position static ou absolute)

Dans quelles conditions un composant doit recalculer sa position ?

- le cadre change de dimensions
- un élement parent est déplacé / change de dimensions / d'orientation
- un élement voisin est déplacé / supprimé / ajouté / change de dimensions / d'orientation

Le calcul peut etre paresseux : il n'est refait que lorsque on le demande au composant.
Le composant est à jour de sa propre orientation, et calcule la position à la scène à la demande.

exemple : un élément dans une liste est déplacé dans une autre liste.

hypothèse:
Les éléments sont pseudo-statiques : en réalité en absolute dans leur parent, empilés en calculant leur width / height.
Si l'on déplace un élément, les autres ne bougent pas.
Un tel event dans une liste suppose que les autres éléments doivent etre prévenus et déclencher une translation qui ne peut etre calculé qu'au runtime
Comment un réajustement peut se déclencher automatiquement dans le contexte Eso ?

- les éléments d'une liste sont censés etre homogènes, créés dans une boucle et placés dans un conteneur.
  Ce conteneur peut recevoir la logique qui lui permet d'agir sur ses enfants ?
  il réagit aux evenements :
- add
- remove
- reorder
  Ces évenements sont traités par le framework qui est à l'initiative des déclenchements.
  Un composant ajouté/retiré dans un slot déclenche l'evenement pour l'ensemble des composants dans le slot. Calcul flip dans une frame :
- mesurer les positions par rapport à un point de référence
- retirer / ajouter l'élément
- mesurer les nouvelles positions
- calculer les différences
- ajouter les translations sur les nouvelles réfs
- animer
  La position sera par défaut relative.

### Normalisation des stories

Chaque story est concue dans son propre cadre de référence. Le cadre est utilisé pour calculer l'échelle d'affichage par rapport à son conteneur.
L'usage habituel consistera à faire se succéder les stories dans le meme conteneur.
Si la scene est fragmentée, par exemple avec deux stories simulanées, l'espace occupé est optimisé automatiquement.
Le facteur zoom est fonction à la fois du cadre général et de celui du conteneur.
On peut écouter l'event rezize du viewport comme de chaque conteneur.

### Les valeurs normalisées doivent rester internes

Une difficulté est que l'utilisateur n'est pas censé utiliser directement les valeurs normalisées, qui ne sont destinées qu'à faciliter les calculs finaux des positions.
La transpositon ne doit se faire qu'à l'intérieur de la libraire d'affichage.

Les valeurs finales sont calculées au render.

Evolution 2022 : que contient un composant ?

- node : l'element du DOM
- parent: composant | root
- state: données des attibuts avant le rendu
- position: x,y,scale,rotation de l'objet normalisés
- update() : encore utile, si update se fait en amont ?
- render(zoom) : calcul des valeurs et application au node
- getAbsolutePosition() renvoie la position absolue en cumulant les positions des parents
