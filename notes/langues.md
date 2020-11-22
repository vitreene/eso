## Les langues
à l'image du shell, les textes sont référencés selon un système cle:valeur
un fichier par langue (import/export facilité)
il faut séparer ce qui vient de la narration, de l'app, de ressources standard
    Ressources standard : textes se retrouvant fréquemment d'une app à l'autre
    Ressources de l'app : constantes dans l'environnement
    Narration, par langue

au niveau js : 

```js
langues = {
    fr: {
        'story01-txt01': 'texte un' ,
        'story01-txt02': '<b>emphase en html</b>' ,
        'story01-txt03': '**emphase en markdown**' ,
...
    },
    en: {
        'story01-txt01': 'text one' ,
        'story01-txt02': '<b>emphasis in html</b>' ,
        'story01-txt03': '**emphasis in markdown**' ,
    }
}

```

voir aussi : https://lingui.js.org/index.html

Les clés reposent sur des conventions de nommage par commodité, mais ne doivent pas servir à déduire la position d'un texte dans la narration

le parametre de langue est envoyé au composant eso qui conserve sa valeur pour les éléments suivants, utile pour les sous-titres par exemple.
un event 'langue" peut etre envoyé en cas de changement de langue. comment distinguer les composant qui ne doivent pas changer (sous-titres par exemple ?)
En plus du parametre de langue, ajouter un parametre {refLangue : 'sous-titre'} qui testera si elle doit tenir compte du changement de langue.
ex:

composant1 = {refLangue : 'langue' }
composant2 = {refLangue : 'sous-titre' }

event : {langue: 'fr'}

seul le composant1 est affecté.
Cela permet de définir autant de clés que necessaire (appli polylangues)

si un changement de langue devait entrainer des changements plus importants (changer la typo, le sens de lecture)
- soit associer une prop className à l'event, mais faudra la defaire à la suivante
- soit envoyer d'abord l'event à un strap qui intégrera la logique nécessaire : 
l'event devient {ns: STRAP, langue: 'fr'} => prévoir la redirection
ou bien, on dirige d'office vers un strap par défaut, qui sera redéfini plus tard ?

Le perso recevra à l'initialisation les parametres refLangue et langue. Les parametres par défaut sont lus dans les paramètres de l'app.

Dans le perso, ce parametre :
- est-il enregistré dans la timeline ? à priori, non
- est traité par content. Les autres paramètres comme le changement de classe est traité en amont par le strap.

## Content dans Bloc
Content peut recevoir 4 types de parametres:
- une string : renvoie la string sans traitement
- un Node : idem *const isDOM = el => el instanceof Element*
- une fonction, par exemple un observable comme Slot
- un object, avec les propriétés : 
    - ref: clé du texte à renvoyer ou
    - text: une string ou un Node
    - langue
    - refLangue
    - effet: nom d'une micro-animation de transition

- selon le composant, Content pourrait etre réécrit ? ex : composant Img

### micro-animations
    ressource: https://splitting.js.org/
    ex: https://codepen.io/jarrodthibodeau/pen/rgmLbG
    https://codepen.io/shshaw/pen/RyOPzb
    https://codepen.io/shshaw/pen/XVjKrG
    https://codepen.io/kristianAndersen/pen/Mqereo

voir aussi:
**https://github.com/lukePeavey/SplitType**
https://github.com/yuanqing/charming
https://github.com/SaucySpray/split-text-js
Text.splitText sur mdn https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText

