import { TestBed } from '@angular/core/testing';
import { ScoreSubmissionService } from './score-submission.service';

describe('ScoreSubmissionService', () => {
  let service: ScoreSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
