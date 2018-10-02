import { Component, OnInit, HostListener } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Level } from '../../interface/level';
import { LevelState } from '../../interface/level-state';
import { Direction } from '../../enums/direction.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  public board: Level;

  constructor(public gameService: GameService) {
    this.board = gameService.board;
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const keyIndx = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].indexOf(event.key);
    if (keyIndx >= 0) {
      const newState = this.gameService.move([Direction.up, Direction.right, Direction.down, Direction.left][keyIndx]);
      if (newState) { this.gameService.curState = newState; }
      if (this.gameService.finished(this.gameService.curState)) {
        this.gameService.setLevel(this.gameService.level + 1);
      }
    }
  }

  hasSwitchWall(rowIndx: number, colIndx: number): boolean {
    const levelSwitch = this.board.switches.map((s, i) => ({s, i})).find(s => s.s.row === rowIndx);
    if (!levelSwitch) { return false; }
    return levelSwitch.s.layout.split('')[colIndx - (this.gameService.curState.switches[levelSwitch.i] ? 1 : 0)] === '│';
  }

  getCharacter(rowIndx: number, colIndx: number) {
    if (this.gameService.curState.position.x === colIndx && this.gameService.curState.position.y === rowIndx) { return '😀'; }
    if (this.gameService.board.finish.x === colIndx && this.gameService.board.finish.y === rowIndx) { return '⭐'; }
    if (colIndx === this.gameService.board.board[rowIndx].length - 1) {
      const levelSwitch = this.gameService.board.switches.map((s, i) => ({s, i})).find(s => s.s.row === rowIndx);
      if (levelSwitch) {
        return this.gameService.curState.switches[levelSwitch.i] ? '↤' : '↦';
      }
    }
    return ' ';
  }

}
