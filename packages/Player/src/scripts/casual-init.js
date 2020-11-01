/* 
charge et lance le jeu
- choisit un mot du vocabulaire,
- crée les cartes et les casses,
-  init la state machine

*/

/* 
placement gagnant, 2 possibilités :
1. transfert des contenus
2. transfert du perso carte. dans ce cas, le conteneur doit etre un slot
un slot peut-il contenir un simple textNode ou faut-il un perso ?
*/

/* 
dans un mot, des lettres peuvent etre répétées ; autoriser autant de cibles que de lettres identiques.
Si un slot est déja occupé :
- il n'est plus disponible comme cible.
- ou il renvoie son contenu a son emplacement d'origine ou bien swappe

*/

/* 
TODO ajouter un event qui initialise le jeu, avec les id des cartes, case et mot à deviner

*/

import { Slot } from '../composants/slot';

import { DEFAULT_NS, STRAP } from '../data/constantes';
import { vocabulary } from '../stories/story02/casual-vocabulary';

export function generateCasual(models) {
	const cardModel = models.find((d) => d.id === 'card');
	const casseModel = models.find((d) => d.id === 'casse');

	console.log('cardModel', models, cardModel);

	const stories = [];
	const { word, letters, remains } = randomWord();
	const cards = generateCards(cardModel, remains);

	const casses = generateCasses(casseModel, letters);

	const eventime = [
		{
			start: 600,
			ns: STRAP,
			name: 'game',
			data: { word, letters, remains, casses, cards },
		},
	];
	stories.push(...cards, ...casses);

	return { stories, eventime };
}

function randomWord() {
	const index = parseInt(Math.random() * vocabulary.length);
	const word = vocabulary[index];
	const letters = word.split('').fill('.', 1, word.length - 1);
	const remains = word
		.split('')
		.slice(1, word.length - 1)
		.sort(() => 0.5 - Math.random())
		.sort(() => 0.5 - Math.random())
		.sort(() => 0.5 - Math.random());
	return { word, letters, remains };
}

function generateCasses(cardModel, letters) {
	const casses = letters.map((letter, index) => {
		const id = cardModel.id + '_' + index + '_' + letter;
		const uuid = 'slot_' + id;
		const slot = new Slot({ uuid });
		slot(letter);
		const [drop, hover, leave] = ['drop', 'hover', 'leave'].map((ev) =>
			cardModel.listen.findIndex((action) => action.event === ev)
		);

		const listen = cardModel.listen.map((l, i) => {
			switch (i) {
				case drop:
					return { ...l, event: 'drop_' + id };
				case hover:
					return { ...l, event: 'hover_' + id };
				case leave:
					return { ...l, event: 'leave_' + id };
				default:
					return l;
			}
		});

		return {
			...cardModel,
			id,
			initial: {
				...cardModel.initial,
				content: slot,
			},
			listen,
		};
	});
	console.log('casses', casses);
	return casses;
}

function generateCards(cardModel, letters) {
	const cards = letters.map((letter, index) => {
		// const index = i + 1;
		const id = cardModel.id + '_' + index + '_' + letter;

		const event = cardModel.emit.pointerdown.data.event + '_' + id;
		const pointerdown = {
			...cardModel.emit.pointerdown,
			data: {
				...cardModel.emit.pointerdown.data,
				id,
				event,
				letter,
				index,
			},
		};

		// index des events
		const [moveCard, dropCard, winCard, idle] = [
			'moveCard',
			'dropCard',
			'winCard',
			'idle',
		].map((ev) => cardModel.listen.findIndex((action) => action.event === ev));

		const listen = cardModel.listen.map((l, i) => {
			switch (i) {
				case moveCard:
					return { ...l, event: 'moveCard_' + id };
				case dropCard:
					return { ...l, event: 'dropCard_' + id };
				case winCard:
					return { ...l, event: 'winCard_' + id };
				case idle:
					return { ...l, event: 'idle_' + id };
				default:
					return l;
			}
		});

		return {
			...cardModel,
			id,
			initial: {
				...cardModel.initial,
				content: letter,
			},
			listen,
			emit: {
				...cardModel.emit,
				pointerdown,
			},
		};
	});

	return cards;
}

// ajouter un event à la dernière carte
// action.name ==='enter' -> transition.oncomplete-> event

// const lastCard = cards[cards.length - 1];
// const [enterAction] = lastCard.actions.filter(
//   (action) => action.name === 'enter'
// );
// console.log('enterAction', enterAction);
// enterAction.transition.oncomplete = {
//   event: { ns: DEFAULT_NS, name: STATIC_TO_ABSOLUTE },
// };
// console.log('cards[cards.length-1]', cards[cards.length - 1]);
