import { STRAP, CONTAINER_ESO } from "../../data/constantes";

export const casualEventimes = {
  name: "start",
  start: 0,
  events: [
    { start: 100, name: "go" },
    { start: 500, name: "initCard" },
    { start: 1000, name: "hover_casse_1_." },
  ],
};

const casse = {
  id: "casse",
  nature: "bloc",
  initial: {
    dimensions: {
      height: "100%",
      width: 100,
    },

    classes: "casse",
    content: "•",
  },
  listen: [
    { event: "initCard", action: "enter" },
    { event: "enter", action: "mouseenter" },
    { event: "leave", action: "mouseleave" },
    { event: "drop", action: "drop" },
    { event: "hover", action: "hover" },
  ],
  actions: [
    {
      name: "enter",
      move: { layer: "presentoir", slot: "presentoir_s01" },
      transition: { to: "fadeIn", duration: 1000 },
    },
    {
      name: "mouseenter",
      classes: "+=casse-canhover",
      dynStyle: { borderRadius: "50%" },
    },
    {
      name: "mouseleave",
      classes: "-=casse-canhover",
      dynStyle: {
        borderRadius: null,
        backgroundColor: null,
      },
    },
    { name: "drop" },
    {
      name: "hover",
      dynStyle: { backgroundColor: "#ff0000" },
    },
  ],
};

const card = {
  id: "card",
  nature: "bloc",
  initial: {
    dimensions: {
      width: 130,
      ratio: 3 / 4,
    },
    classes: "card",
    content: "CARD",
  },
  listen: [
    { event: "initCard", action: "enter" },
    { event: "moveCard", action: "moveCard" },
    { event: "dropCard", action: "dropCard" },
  ],
  actions: [
    {
      name: "moveCard",
      dynStyle: {
        backgroundColor: "#00FF00",
      },
    },
    {
      name: "dropCard",
      dynStyle: {
        backgroundColor: null,
      },

      transition: { duration: 300, to: { left: 0, top: 0 } },
    },

    {
      name: "enter",
      move: { layer: "sabot", slot: "sabot_s01" },
      transition: { to: "fadeIn" },
    },
  ],

  emit: {
    pointerdown: {
      event: { ns: STRAP, name: "drag" },
      data: { id: "card", event: "moveCard" },
    },
  },
};

// ============================================================
// LAYERS
// ============================================================
const root = {
  id: CONTAINER_ESO,
  nature: "layer",
  initial: {
    classes: "container",
    content: [
      {
        id: "s01",
        statStyle: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "grid",
          gridColumn: 1,
          gridRow: 1,
        },
      },
    ],
  },
  // listen: [{ event: "init", action: "enter" }],
};

const casual = {
  id: "casual",
  nature: "layer",
  initial: {
    style: { background: "#ff00ee" },
    classes: "casual",
    content: [
      { id: "s01", statStyle: { gridRow: 1 } },
      { id: "s02", statStyle: { gridRow: 2 } },
      { id: "s03", statStyle: { gridRow: 3 } },
      { id: "s04", statStyle: { gridRow: 4 } },
    ],
  },
  listen: [{ event: "start", action: "enter" }],
  actions: [
    {
      name: "enter",
      move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + "_s01" },
      order: 1,
    },
  ],
};

const plateau = {
  id: "plateau",
  nature: "layer",
  initial: {
    classes: "plateau",
    content: [{ id: "s01" }],
  },
  listen: [{ event: "go", action: "enter" }],
  actions: [
    {
      name: "enter",
      move: { layer: "casual", slot: "casual_s03" },
      order: 1,
    },
  ],
};

const presentoir = {
  id: "presentoir",
  nature: "layer",
  initial: {
    dimensions: {
      width: "80%",
    },
    classes: "presentoir",
    content: [{ id: "s01" }],
  },
  listen: [{ event: "go", action: "enter" }],
  actions: [
    {
      name: "enter",
      move: { layer: "casual", slot: "casual_s02" },
      order: 1,
    },
  ],
};

const sabot = {
  id: "sabot",
  nature: "layer",
  initial: {
    dimensions: { width: "80%" },
    classes: "sabot",
    content: [{ id: "s01", statStyle: { gridRow: 1 } }],
  },
  listen: [{ event: "go", action: "enter" }],
  actions: [
    {
      name: "enter",
      move: { layer: "casual", slot: "casual_s04" },
      order: 1,
    },
  ],
};

const infos = {
  id: "infos",
  nature: "bloc",
  initial: {
    dimensions: {
      width: "80%",
    },
    classes: "infos h1",
    content: "Devinez le mot !",
  },
  listen: [{ event: "go", action: "enter" }],
  actions: [
    {
      name: "enter",
      move: { layer: "casual", slot: "casual_s01" },
      order: 1,
    },
  ],
};

const empty = {
  id: "",
  nature: "",
  initial: {},
  listen: [],
  actions: [],
  emit: {},
};

export const prepCasuals = [card, casse];
export const casuals = [root, casual, sabot, plateau, presentoir, infos];
