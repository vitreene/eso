/* 
TODO ajouter un event qui initialise le jeu, avec les id des cartes, case et mot à deviner
*/

import { vocabulary } from './casual-vocabulary';
import { STRAP } from '../../data/constantes';

export function generateCasual({ cardModel, casseModel }) {
	const stories = [];
	const { word, letters, remains } = randomWord();
	const cards = remains.map(cardModel);
	const casses = letters.map(casseModel);
	const eventimes = [
		{
			start: 600,
			ns: STRAP,
			name: 'game',
			data: { word, letters, remains, casses, cards },
		},
	];
	stories.push(...cards, ...casses);
	return { stories, eventimes };
}

function randomWord() {
	const index = parseInt(Math.random() * vocabulary.length);
	const word = vocabulary[index];
	const letters = word.split('').fill('.', 1, word.length - 1);
	const remains = word
		.split('')
		.slice(1, word.length - 1)
		// bien bien bien mélanger
		.sort(() => 0.5 - Math.random())
		.sort(() => 0.5 - Math.random())
		.sort(() => 0.5 - Math.random());
	return { word, letters, remains };
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
