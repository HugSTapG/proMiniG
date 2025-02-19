// leaderboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { LeaderboardEntry } from '../interfaces/index.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private readonly privateKey = 'sep4U0aGMUep5OkujkUU5gYjndu9qRnkGXvIjj3dS-Tw';
  private readonly publicKey = '67b5ec548f40bd0240afc1b4';
  private readonly baseUrl = 'http://dreamlo.com/lb';

  constructor(private readonly http: HttpClient) {}

  addScore(name: string, score: number): Observable<any> {
    const url = `${this.baseUrl}/${this.privateKey}/add/${name}/${score}`;
    
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error in addScore:', error);
        throw error;
      })
    );
  }

  getScores(): Observable<LeaderboardEntry[]> {
    const url = `${this.baseUrl}/${this.publicKey}/json`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response?.dreamlo?.leaderboard) {
          return [];
        }
        const entries = response.dreamlo.leaderboard.entry || [];
        return Array.isArray(entries) ? entries : [entries];
      }),
      catchError(error => {
        console.error('Error in getScores:', error);
        return of([]);
      })
    );
  }
}