import { TestBed } from '@angular/core/testing';
import { TypeGameStateService } from './type-game-state.service';

describe('TypeGameStateService', () => {
  let service: TypeGameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeGameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
