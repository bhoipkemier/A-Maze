import { Injectable } from '@angular/core';
import { Level } from '../interface/level';
import { LevelState } from '../interface/level-state';

@Injectable({
  providedIn: 'root'
})
export class LevelGeneratorService {

  constructor() { }

  public getNumberOfLevels(): number {
    return this.getSwitchSettings().length;
  }

  private getSwitchSettings(): Array<Array<boolean>> {
    return [
      [true, false, false, true],
      [false, false, false, true],
      [false, true, false, true],
      [true, true, false, true],
      [true, true, true, true],
      [true, false, true, true],
      [false, true, true, true],
      [false, false, true, true],
      [true, true, true, false],
      [true, false, true, false],
      [true, true, false, false],
      [true, false, false, false],
      [false, true, true, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, false]
    ];
  }

  public initState(level: number): LevelState {
    const switchSettings = this.getSwitchSettings();
    if (switchSettings.length <= level) { return undefined; }
    return {
      switches: switchSettings[level],
      position: this.getBoard().start,
      previousState: undefined
    };
  }

  public getBoard(): Level {
    return <Level>{
      board: [
        '───┬────┐──┬──┌─',
        ' ┌┬┴┬┐─┬┼─┬┼──┤ ',
        '┌┤└┐│└─┘└─┘└──┴┐',
        '││││└─┬─┌──┬───┘',
        ' │├┴─┌┴─┴─┌┴─┬┐ ',
        '┌┤│┌┐└── ─┴─┐││ ',
        '││└┘├─┬─┌───┘││ ',
        ' │─┬┘┌┴─├─ ─┬┘│ ',
        '┌┼─┘─┤┌┐│┌┐┌┴─└┐',
        '│└┬─┌┘│└┴┤│└┐│┌┘',
        ' ┌┴─┴┬┴─┌┴┘─┴┼┤ ',
        ' └───┴──└────┘└─'
      ],
      start: {x: 15, y: 0},
      finish: {x: 15, y: 11},
      switches: [
        { row: 1, layout: '  │││   ││ │    '},
        { row: 4, layout: '   │  │ │   ││  '},
        { row: 7, layout: '   │  │  │  │   '},
        { row: 10, layout: '  │││ │  │  ││  '}
      ]
    };
  }
}
