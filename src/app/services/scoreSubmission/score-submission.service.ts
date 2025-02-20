import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaderboardService } from '../index.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreSubmissionService {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  submitScore(name: string, score: number): Observable<any> {
    return this.leaderboardService.addScore(name.toUpperCase(), score);
  }
}
