import { BoardLocation } from './board-location';

export interface LevelState {
  position: BoardLocation;
  switches: Array<boolean>;
  previousState: LevelState;
}
