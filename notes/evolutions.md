## Hiérarchie de la structure

Chaque projet est une narration  découpée en :
 - chapitres
 - pages
 - story
 - composants
 - medias
    - images
    - sons
    - videos
    - textes

- un projet peut contenir plusieurs narrations (= summary dans le Shell), ou bien une narration dont le contenu est conditionnel selon des profils.
- les chapitres peuvent etre imbriqués en sous-chapitres de niveau n
- les pages sont des compositions de stories
- les stories peuvent etre imbriquées en niveau n

## Les parametres

### project
(config / interface dans le Shell)
- dimensions de référence de l'écran
- type scorm
- ressources globales : couleurs, logo, signature, nom du projet
- chemins des ressources media
- page initiale

### narrative
- nom 
- structure conditionnelle des chapitres selon des parametres de profils : 
    - is / isnot / and
    - case
    - enum
    garder une structure simple pour garder de la lisibilité
Les conditions / critères sont passés aux éléments enfants
Il existe des pages sans chapitres type accueil, sommaire, help...

Narrative et chapters sont identiques dans leur stucture.
Que veut dire narrative ? la possibilité de parcourir le projet selon plusieurs parcours.

### chapters
- meme systeme de conditions que pour narrative
- préfixe par niveau
- lecture par ordre d'apparition; 
- si l'élément est un chapitre, lire le contenu du chapitre
- si l'on atteint la fin d'un chapitre remonter d'un niveau et poursuivre
par chapitre : 
    - Arborescence : 
        - chaque chapitre contient des pages, et des sous-chapitres
        - on peut limiter la profondeur à 6 niveaux
    - id
    - ref titre 
    - visible dans le sommaire

### pages
- id
- titre
- story initial
- story root
- liste de stories
    - id
    - root
    - start

- parametres d'initialisation 
    - contraintes de navigation 
- entrée et sortie de page : clear

### stories
une partie autonome de la narration d'une page. 
- recoit un slot root 
- event start
une story peut envoyer et recevoir des messages d'une autre story. il faut s'assurer de la présence en scène des deux parties

Les persos, et events sont ajoutés au store général. 
le store est effacé au changement de page. 
si on utilise une timeline, il vaut mieux conserver tous les élements, meme ceux disparus de la scène.

**Instances** : une story peut etre appelée plusieurs fois, séquentiellement (un jeu) ou simultanément (un input pourrait etre une story)
- comment anvoyer des messages à une instance dont on ne connait pas forcément le nom, ou dont on veut ignorer le nom car il n'y a qu'une instance à la fois ?
et si instance = modele, donc création ad-hoc des events dédiés ?
et persos = uniques , cela peut s'appliquer à une story ?
une story = un modele ? 

Concevoir la story comme une fonction / model qui a besoin :
- id/key
- root
- event : start
root et eventime sont gérés à l'extérieur de la story ?


```js
const story = (id, root)=>({
id,
nature:'story'
initial: {
    path:'path/to/story/', // ? 
    persos:['item1', 'item2', '...'],
    straps:['item1', 'item2', '...'],
    eventimes:[]
},
listen: ['start'], // raccourci pour {ns:'anim', event: start, action: 'start'}
actions : [
    {
        name: 'start',
        move: root // raccourci pour {layer: '', slot: root}
    }
]
})
```
probleme de ce modele : 
il ne permet pas de réfléchir en terme de présentation
à comparer avec le modele linéaire du Shell
ici, c'est un ensemble de composants  assemblés
 -> approche pour des intéractions, mais pour une **narration** ?

 La réponse pourrait etre avec un autre niveau de définition des composants :
-  graphique,
- narration,
qui seraient transcris sous cette forme.

certaines stories très intéractives comme la télécommande, conviennent à l'approche tout json.

elle consigne les refs des persos qu'elle gere, pour pouvoir les purger au besoin.

Tant qu'une page n'est pas achevée, et la mémoire purgée, les instances s'accumulent, générant potentiellement une mémoire saturée (un générateur d'instances par exemple)
La story terminée n'est pas effacée au cas où la timeline revienne dessus

- soit il y a une limite à la quantité d'elements stockés (difficile à gérer), 
- soit les nodes sont recréés ad-hoc en cas de manip de la timeline : c'est lourd, mais ce mode n'est pas censé etre optimisé pour la vitesse. 
- je peux prévoir une purge auto de la story en fin de lecture, au loisir de ne pas s'en servir.
