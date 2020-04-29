import snake0 from './assets/snake/snake0.png';
import snake1 from './assets/snake/snake1.png';
import snake2 from './assets/snake/snake2.png';
import snake3 from './assets/snake/snake3.png';

import demon0 from './assets/demon/demon_0.png';
import demon1 from './assets/demon/demon_1.png';
import demon2 from './assets/demon/demon_2.png';
import demon3 from './assets/demon/demon_3.png';

import knight0 from './assets/knight/knight_0.png';
import knight1 from './assets/knight/knight_1.png';
import knight2 from './assets/knight/knight_2.png';
import knight3 from './assets/knight/knight_3.png';

import wizzard0 from './assets/wizzard/wizzard_0.png';
import wizzard1 from './assets/wizzard/wizzard_1.png';
import wizzard2 from './assets/wizzard/wizzard_2.png';
import wizzard3 from './assets/wizzard/wizzard_3.png';

import zombie0 from './assets/zombie/zombie_0.png';
import zombie1 from './assets/zombie/zombie_1.png';
import zombie2 from './assets/zombie/zombie_2.png';
import zombie3 from './assets/zombie/zombie_3.png';

import mushroomPNG from './assets/mushroom/mushroom.png';
import { Images } from '../types';

export const images: Images = {
  demon: {
    frames: [demon0, demon1, demon2, demon3],
    width: 33,
    height: 40,
  },
  knight: {
    frames: [knight0, knight1, knight2, knight3],
    width: 16,
    height: 25,
  },
  wizzard: {
    frames: [wizzard0, wizzard1, wizzard2, wizzard3],
    width: 16,
    height: 25,
  },
  zombie: {
    frames: [zombie0, zombie1, zombie2, zombie3],
    width: 33,
    height: 40,
  },
  mushroom: {
    frames: [mushroomPNG],
    width: 16,
    height: 16,
  },
  snake: {
    frames: [snake0, snake1, snake2, snake3],
    width: 10,
    height: 10,
  },
};
