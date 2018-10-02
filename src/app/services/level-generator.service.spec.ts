import { TestBed, inject } from '@angular/core/testing';

import { LevelGeneratorService } from './level-generator.service';

describe('LevelGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelGeneratorService]
    });
  });

  it('should be created', inject([LevelGeneratorService], (service: LevelGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
