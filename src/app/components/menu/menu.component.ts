import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(public gameService: GameService) { }

  public reset() {
    this.gameService.setLevel(this.gameService.level);
  }

  public previousLevel() {
    this.gameService.setLevel(this.gameService.level - 1);
  }

  public nextLevel() {
    this.gameService.setLevel(this.gameService.level + 1);
  }

}
