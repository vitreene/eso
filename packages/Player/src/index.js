import { Chapter } from './Chapter';
import './style.css';

const Player = async (path) => new Chapter({ path });

// const path = '/stories/App21.yml';
const path = '/stories/scenes01.yml';
Player(path);
