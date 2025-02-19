// leaderboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  // Replace these with your dreamlo public/private keys
  private readonly privateKey = 'zfL2HEGZbEWBhC_sXgBZxQuH2RknyRlUGeN1nF37hcKA';
  private readonly publicKey = '67b5e5cd8f40bd0240afb2eb';
  private readonly baseUrl = `http://dreamlo.com/lb`;

  constructor(private readonly http: HttpClient) {}

  // Add new score
  addScore(name: string, score: number): Observable<any> {
    const url = `${this.baseUrl}/add/${this.privateKey}/${name}/${score}`;
    return this.http.get(url);
  }

  // Get top scores
  getScores(): Observable<LeaderboardEntry[]> {
    const url = `${this.baseUrl}/${this.publicKey}/json`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response || !response.dreamlo || !response.dreamlo.leaderboard) {
          return [];
        }
        const entries = response.dreamlo.leaderboard.entry;
        return Array.isArray(entries) ? entries : [entries];
      })
    );
  }
}