## Completer Transitions
- déplacer les transitions comme fonction statique d'Eso
- regrouper avec reslot

controle des transitions
- identifier les transitions associées à un perso
- definir dès register/actions l'ensemble des propriétés qui seront concernées par les transitions
- permet de définir les états du perso et de passer de l'un à l'autre
- pour le moment ,ne tient pas compte des styles touchés par un strap
- les props de base : position, transform, color sont repertoriées par défaut
- regrouper les propriétés selon la durée de transition
- faut-il accepter dans une seule action un enchainement de transitions ? faut-il utiliser un délai ?
- intégrer les capactés de l'interpolateur : repeat, yoyo. 

- invalider anim : 
un mécanisme d'interruption permet de redefinir une transition lorsqu'une nouvelle arrive qui utilise les memes propriétés
- voir à ce sujet les anims additives


