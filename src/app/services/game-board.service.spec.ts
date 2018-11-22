import { TestBed, inject } from '@angular/core/testing';

import { GameBoardService } from './game-board.service';

describe('GameBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameBoardService]
    });
  });

  it('should be created', inject([GameBoardService], (service: GameBoardService) => {
    expect(service).toBeTruthy();
  }));
});
