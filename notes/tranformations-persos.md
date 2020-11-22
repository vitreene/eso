## transformation des fichiers à partir des sources YAML

L'objectif est de proposer une écriture compacte des fichiers YAML, qui evite la redondance pour limiter les erreurs et améliorer la lisibilité. 
L'écriture développée de certains parametres reste acceptée 

Ces transformations peuvent aller jusqu'à revoir la structure finale des composants, notamment sur ce qui doit etre des objets ou des tableaux.

1. Persos

Les persos sont regroupés dans un tableau. 
Chaque entrée débute par une référence au composant constructeur : bloc, img, sprite...
L'index du tableau servira à tenir l'ordre de création des éléments et leur insertion dans le DOM en cas d'égalité.