import { BoardLocation } from './board-location';
import { LevelSwitch } from './level-switch';

export interface Level {
  board: Array<string>;
  start: BoardLocation;
  finish: BoardLocation;
  switches: Array<LevelSwitch>;
}
