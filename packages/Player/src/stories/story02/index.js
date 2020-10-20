import "./casual.css";
import {
  prepCasuals,
  casuals,
  casualEventimes as eventimes,
} from "./casual-persos";
import { generateCasual } from "../../scripts/casual-init";

const { stories: cards, eventimes: casualEvents } = generateCasual(prepCasuals);

const stories = {};
for (const story of casuals.concat(cards)) stories[story.id] = story;

export { stories, eventimes };
