import { Chapter } from './Chapter';
import './style.css';

const Player = async (path) => new Chapter({ path, scene: 'scene2' });
const path = '/stories/scenes01.yml';

// const Player = async (path) => new Chapter({ path });
// const path = '/stories/App21.yml';

Player(path);
