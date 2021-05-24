import { Chapter } from './Chapter';
import './style.css';

const audio = new AudioContext();

const path = '/stories/scenes01.yml';
const Player = async (path) => new Chapter({ path, audio, scene: 'scene2' });

// const Player = async (path) => new Chapter({ path });
// const path = '/stories/App21.yml';

Player(path);
