import { Injectable } from '@angular/core';
import { Level } from '../interface/level';
import { LevelGeneratorService } from './level-generator.service';
import { LevelState } from '../interface/level-state';
import { Direction } from '../enums/direction.enum';
import { BoardLocation } from '../interface/board-location';
import { LevelSwitch } from '../interface/level-switch';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  board: Level;
  curState: LevelState;
  level = 0;
  private solution: LevelState;
  private solutionInterval: number;

  constructor(private levelGeneratorService: LevelGeneratorService) {
    this.board = this.levelGeneratorService.getBoard();
    this.curState =  this.levelGeneratorService.initState(0);
  }

  public setLevel(level: number) {
    this.curState = this.levelGeneratorService.initState(level);
    this.level = level;
  }

  public getNumberOfLevels(): number {
    return this.levelGeneratorService.getNumberOfLevels();
  }

  public canMove(direction: Direction, state?: LevelState): boolean {
    const sourceState = state ? state : this.curState;
    return this.pathAvailable(sourceState.position, direction) &&
      !this.switchObstruction(sourceState, direction);
  }

  public move(direction: Direction, state?: LevelState): LevelState {
    if (!state) { this.solution = undefined; }
    const sourceState = state ? state : this.curState;
    if (!this.canMove(direction, sourceState)) { return undefined; }
    const destState = Object.assign({}, sourceState);
    destState.previousState = sourceState;
    const collidingSwitch = this.collidingSwitch(sourceState, direction);
    destState.position = this.getNewPosition(sourceState.position, direction);
    if (collidingSwitch) {
      const indx = this.board.switches.indexOf(collidingSwitch.levelSwitch);
      destState.switches = sourceState.switches.map((s, i) => i === indx ? !s : s);
    }
    if (!state) { this.curState = destState; }
    return destState;
  }

  public solve(): void {
    if (this.finished(this.curState)) { return; }
    const visited = new Set<string>();
    const toSearch: Array<LevelState> = [this.curState];
    let finishState: LevelState;
    while (toSearch.length > 0 && !finishState) {
      const state = toSearch.splice(0, 1)[0];
      finishState = this.explorePosition(state, toSearch, visited);
    }
    this.solution = finishState;
    this.autoMove();
  }

  private autoMove(): void {
    if (!this.solution) { return; }
    window.clearInterval(this.solutionInterval);
    this.solutionInterval = window.setInterval(() => {
      if (!this.solution) { window.clearInterval(this.solutionInterval); }
      let nextState = this.solution;
      while (nextState && nextState.previousState !== this.curState) {
        nextState = nextState.previousState;
      }
      if (nextState) { this.curState = nextState; }
      if (this.finished(this.curState)) {
        this.setLevel(this.level + 1);
        window.clearInterval(this.solutionInterval);
      }
    }, 250);
  }

  private explorePosition(sourceState: LevelState, toSearch: Array<LevelState>, visited: Set<string>): LevelState {
    let toReturn: LevelState;
    [Direction.up, Direction.right, Direction.down, Direction.left].forEach(direction => {
      const newState = this.move(direction, sourceState);
      if (newState) {
        const hash = this.getHash(newState);
        if (!visited.has(hash)) {
          visited.add(hash);
          if (this.finished(newState)) { toReturn = newState; }
          toSearch.push(newState);
        }
      }
    });
    return toReturn;
  }

  private getHash(levelState: LevelState): string {
    return JSON.stringify({ position: levelState.position, switches: levelState.switches });
  }

  public finished(state: LevelState): boolean {
    return state.position.x === this.board.finish.x && state.position.y === this.board.finish.y;
  }

  private switchObstruction(state: LevelState, direction: Direction): boolean {
    const collisionSwitch = this.collidingSwitch(state, direction);
    return collisionSwitch &&
           ((collisionSwitch.switchState && direction === Direction.right) ||
           (!collisionSwitch.switchState && direction === Direction.left));
  }

  private collidingSwitch(state: LevelState, direction: Direction): { levelSwitch: LevelSwitch, switchState: boolean} {
    const levelSwitch = this.board.switches
      .map((s, i) => ({ levelSwitch: s, switchState: state.switches[i] }))
      .find(s => s.levelSwitch.row === state.position.y);
    if (direction === Direction.up || direction === Direction.down || !levelSwitch) { return undefined; }
    let layout = levelSwitch.levelSwitch.layout;
    if (levelSwitch.switchState) { layout = ' ' + layout; }
    const positionToConsider = direction === Direction.left ? state.position.x : state.position.x + 1;
    return layout[positionToConsider] !== ' ' ? levelSwitch : undefined;
  }

  private pathAvailable(curPosition: BoardLocation, direction: Direction): boolean {
    const entranceDirection = this.getEntranceDirection(direction);
    const positionAfterMove = this.getNewPosition(curPosition, direction);
    return this.canAccess(curPosition, direction) &&
           this.canAccess(positionAfterMove, entranceDirection);
  }

  private getNewPosition(position: BoardLocation, direction: Direction): BoardLocation {
    return {
      x: direction === Direction.left ? position.x - 1 :
         direction === Direction.right ? position.x + 1 : position.x,
      y: direction === Direction.up ? position.y - 1 :
         direction === Direction.down ? position.y + 1 : position.y
    };
  }

  private canAccess(position: BoardLocation, side: Direction): boolean {
    if (position.y < 0 || position.x < 0 || position.y >= this.board.board.length ||
      position.x >= this.board.board[position.y].length) { return false; }
    const space = this.board.board[position.y][position.x];
    return side === Direction.up && '│└┘├┤┴┼'.indexOf(space) >= 0 ||
      side === Direction.right && '┌└├┬┼─┴'.indexOf(space) >= 0 ||
      side === Direction.down && '┐┌├┤┬┼│'.indexOf(space) >= 0 ||
      side === Direction.left && '┐┘┤┬┴┼─'.indexOf(space) >= 0;
  }

  private getEntranceDirection(exitDirection: Direction): Direction {
    return exitDirection === Direction.up ? Direction.down :
           exitDirection === Direction.down ? Direction.up :
           exitDirection === Direction.left ? Direction.right : Direction.left;
  }
}
