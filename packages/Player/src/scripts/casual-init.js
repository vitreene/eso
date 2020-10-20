/* 
charge et lance le jeu
- choisit un mot du vocabulaire,
- crée les cartes et les casses,
-  init la state machine

*/
import { vocabulary } from "../stories/story02/casual-vocabulary";

export function generateCasual(datas) {
  const cardModel = datas.find((d) => d.id === "card");
  const casseModel = datas.find((d) => d.id === "casse");

  console.log("cardModel", datas, cardModel);

  const stories = [];
  const eventimes = {};
  const { word, letters, remains } = randomWord();
  const cards = generateCards(cardModel, remains);
  const casses = generateCasses(casseModel, letters);

  stories.push(...cards, ...casses);

  return { stories, eventimes };
}

function randomWord() {
  const index = parseInt(Math.random() * vocabulary.length);
  const word = vocabulary[index];
  const letters = word.split("").fill(".", 1, word.length - 1);
  const remains = word
    .split("")
    .slice(1, word.length - 1)
    .sort(() => 0.5 - Math.random());
  return { word, letters, remains };
}

function generateCasses(cardModel, letters) {
  const casses = letters.map((letter, index) => {
    const id = cardModel.id + "_" + index + "_" + letter;

    const [drop, hover, leave] = ["drop", "hover", "leave"].map((ev) =>
      cardModel.listen.findIndex((action) => action.event === ev)
    );

    const listen = cardModel.listen.map((l, i) => {
      switch (i) {
        case drop:
          return { ...l, event: "drop_" + id };
        case hover:
          return { ...l, event: "hover_" + id };
        case leave:
          return { ...l, event: "leave_" + id };
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
    };
  });
  console.log("casses", casses);
  return casses;
}

function generateCards(cardModel, letters) {
  const cards = letters.map((letter, index) => {
    const id = cardModel.id + "_" + index + "_" + letter;

    const event = cardModel.emit.pointerdown.data.event + "_" + id;
    const pointerdown = {
      ...cardModel.emit.pointerdown,
      data: {
        ...cardModel.emit.pointerdown.data,
        id,
        event,
      },
    };

    const [moveCard, dropCard] = ["moveCard", "dropCard"].map((ev) =>
      cardModel.listen.findIndex((action) => action.event === ev)
    );

    const listen = cardModel.listen.map((l, i) => {
      switch (i) {
        case moveCard:
          return { ...l, event: "moveCard_" + id };
        case dropCard:
          return { ...l, event: "dropCard_" + id };
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
