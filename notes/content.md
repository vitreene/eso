## Content

une classe pour organiser les contenus.
content contient les parametres dédiés au contenu affiché.

Les cntenus sont actuellement répartis en plusieurs endroits :

- dans Eso pour les textes,
- dans les composants pour du spécifique (image)

Le composant Content devrait permettre de construire le rendu à la demande
Centraliser les ressources

### types de contenus

- raw : défini par défaut, une string qui désigne soit un texte brut, soit une clé de texte.
  attribut est un attribut, pas un type.
- **text** : contenu textuel, direct ou indirect par clé

  - text
  - key
  - rich : imaginer d'accorder l'emploi d'un sous-ensemble du html dédié au texte riche
  - effect
  - lang?
  - sub?
    plus tard : lang, sub sont optionnels, il pourrait en exister d'autres, à déclarer à l'init du projet

- **img**

  - src
  - fit
  - effect : tiny-effects

- **slot**
  par défaut, slot expose directement son contenu, serait-il pertineent d'ajouter d'autres propriétés, telles que :

  - src : tableau des contenus
  - order? : retient l'ordre d'insertion des elements ?
  - seat / stack ? -> rendu des éléments dans le slot

- **html/svg** : déclarer explicitement du contenu du contenu demandant à etre sanitisé.

d'autres types de contenus peuvent etre concus pour des composants spécifiques, tel que polygone, trame...

text img, slot ont besoin d'un acces à une ressource (imageCollection, messages, Slots)
un format icon pourrait faire appel à une source de svg par exemple

---

Le constructeur de la classe tient un régistre de tous les types déclarés ; un composant doit choisir le type qu'il emploie. Il ne peut etre changé ensuite.

register fournit un objet :

- type / name / nature /id
- collection / store / ressource
  deux fonctions :
- update( content, current) -> new-content
- prerender( content, current) -> new-content-rendered

register doit etre construit lorsque toutes les ressources sont disponibles

Content fait-il partie de Eso ou de Scene ? ou est-ce encore un autre module ?
-> il pourrait etre combiné avec composants
-> Collections : imageCollection, StoreSlots, Messages

Perso = Eso + Content + Composant

note sur les imports et straps :
tous les imports de scripts sont réalisés au lancement puis filtrés par Scene selon les besoins.
idéalement, il faudrait les charger uniquement au lancement de la Scen, mais pas de compliation js dans ce cas ?

## factory

-> lorsqu'un type de content est déclaré :

- créer une classe qui integre les parametres (update, prerender, collection)
- lister les natures auxquelles elle s'applique

## Assemblage

Scene constuctor :

- register Content -> ImageCollections, Messages, StoreSlots

- register Composants -> Composant + Eso + Content  
  le composant doit dire à quel Content il s'associe
- separer Eso de transition

les déclarations de persos se font sur des classes composées ;
intégrer preInit aux classes

Apparait deux questions

- complexité
- destination

un Bloc peut recevoir du texte sous forme de textContent ou de innerHtml.
entre les deux,il pourrait recevoir du rich text
comment signaler

- la nature du texte
  - dans la description du composant,
  - dans la clé de texte,
- Content doit-il gérer tous les type de contenus texte et html dans un seul composant ; dans ce cas, à quoi bon spécialiser image et slot ?

pour garder la construction des composants simples, l'injection d'Eso et de Content est faite au préalable. Est-ce une bonne chose ?
La construction du composant est éclatée, rendant sa lisibilité et ses corrections difficiles
Ilfaut aussi intégrer PrepInit qui permet de conformer initial au composant. PrepInit doit avoir acces aux collections, sans pour autant faire partie d'Eso...

Basculer register perso, Pre, Composants vers Veso :
tout c qui à besoin de Sinuous passe chez Veso.
Ultérieurement, pourquoi ne pas passer à Solid ?
Il y a trop d'aller-retour Player/Veso pour le moment.
