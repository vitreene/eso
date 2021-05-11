import { Audio2D } from 'audio2d';

import { Chapter } from './Chapter';
import './style.css';

const audio = new Audio2D();
const path = '/stories/scenes01.yml';
const Player = async (path) => new Chapter({ path, audio, scene: 'scene3' });

// const Player = async (path) => new Chapter({ path });
// const path = '/stories/App21.yml';

Player(path);
