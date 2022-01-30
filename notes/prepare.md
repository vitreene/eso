# Prepare

en ref au schéma eso-lib

Prepare est chargé de transformer les updates complexes en suite d'updates simples.

Un update simple est un objet venant modifier directement un Perso.

Un update complexe necessite auparavant d'être analysé pour propduire un update ou une suite d'updates.
**Tween** déclenche une interpolation qui génére une série d'updates réparties dans le temps.
**Reslot** analyse la position des parents d'un Perso, et déclenche un tween entre les deux positions
**Resize** change la valeur d'échelle d'un groupe ou de la totalité des Persos affichés

Ce que le schéma ne montre pas :
A. comment utiliser seek et renvoyer un état de la scène à un instant donné.

- les updates complexes qui emploient leur propre ligne de temps doivent recevoir une propriété "progress"
- les Perso doivent connaitre qui est leur parent
- chaque Perso doit connaitre ses transformations, et celles dont il hérite

- Move doit explorer les arbres de parenté des Persos source et destination, afin de connaitre leur position et transformation exacte au début de la transition.
