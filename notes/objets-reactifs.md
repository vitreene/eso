# Objets réactifs

Ces objets observent certaines actions et activent automatiquement les events associés.

exemple : Liste
Le composant liste présente un groupe d'objets. Si un objet est ajouté, déplacé ou retiré, les autres sont replacés automatiquement.
Le déplacements automatiques dépendent des choix de postionnement, en liste, en grille...

exemple : Pin
Une épingle donne une position en rapport avec l'élément qu'elle désigne : par exemple, un sujet sur une image. Si l'image est transformée (déplacée, tournée, aggrandie) Pin indique toujours l'objet désigné.
D'autres objets peuvent s'accrocher à un Pin. Lorsque sa position est modifiée, les éléments accrochés se mettent à jour.
Il peut y avoir une différence entre les coordonnées du Pin et l'élement accroché qui peut etre placé par exemple à une certaine distance.

Pin peut servir à placer des fleches sur une image en fond d'écran.

Où placer dans l'organigramme le traitement de ces objets réactifs ?

- les éléments dépendants sont à l'écoute de ces objets
- ou bien l'objet dresse une liste des éléments qui en dépende
- en cas de modification, un calcul est fait des nouvelles positions
- les nouvelles positions sont envoyés par des évents, et inscrits dans la timeline.
