import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameService } from './services/game.service';
import { LevelGeneratorService } from './services/level-generator.service';
import { BoardComponent } from './components/board/board.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    GameService,
    LevelGeneratorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
