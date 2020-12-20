# les chantiers :
## un système d'écriture des fichiers en yaml
    - definition de la syntaxe 
        - definition des persos
        - definitions des events
        - défintion des pages, chapitres...
        - ressources langues
    - parser

## un éditeur visuel

## structure d'une page, et de l'application
Organisation du monorepo
un workspace *Project* destiné à y placer les contenus 
- medias
- yaml
    - summaries
    - chapters
    - scenes
    - stories
    - config
- css


## parametres d'application :
    - langue, sous-titres,
    - zoom ?
    - lecture auto / plein ecran / contraintes globales de lecture

## micro-animation sur les textes
    - effets nommés 
    
## refs et langues pour les textes
ref et langues pourraient etre résolues lors du parsage, et autoriser une écriture simplifiée en intégrant des réglages par défaut.
Cependant, si je garde la possibilité d'avoir de modifier au runitme, il faut garder de la logique dans le composant

## Scene 
Une scene est une compostion d'une ou plusieurs stories. 
Une story ne peut apparaitre qu'une seule fois dans une scene
Une story peut-elle en contenir une autre, ou bien une scene peut en contenir une autre ?

### instanciation d'une story
-> Dans le contexte du shell, peu utile. Mais pour vitreene ?
une story pourrait-elle néanmoins apparaitre une fois dans deux scenes imbriquées dans une troisième ?

Comment isoler une story pour pouvoir l'instancier ?
il faut :
#### root
Le point d'entrée est unique et distinct. Il dépend du parent.

#### zoom et cadre
La story se joue dans un cadre virtuel, centré dans le slot où il est monté.
Le zoom est calculé par rapport au parent, mais il n'est recalculé qu'en cas de resize global de la fenetre

#### id's
Les persos ne doivent pas pouvoir s’« appeler » par leurs id. Seuls les messages des events permettent de les modifier. 
Les ids doivent etre générés aléatoirement.

Á refléchir : une propriété "name" qui a le role d'un id, défini par l'utilisateur, pour addresser quelque chose au perso nommé (cela contredit l'affirmation précédente ). 
Cela pourrait servir pour utiliser des composants tierce-parties qui cherchent un node à partir de leur id

Les id peuvent etre préfixés par le nom de la story

#### events
Les events agissent dans un contexte, par défaut celui de la story 
Par défaut, les évents définis à l'intérieur d'une story n'agissent que sur elle.
si un perso doit répondre à un event, il utilise le canal "main" 
les stories pourraient aussi capter des events "main" et les transmettre en interne
