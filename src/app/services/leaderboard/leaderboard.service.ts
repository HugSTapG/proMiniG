import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { LeaderboardEntry } from '../../interfaces/index.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class LeaderboardService {
  private readonly privateKey = environment.dreamlo.privateKey;
  private readonly publicKey = environment.dreamlo.publicKey;
  private readonly baseUrl = environment.dreamlo.baseUrl;

  constructor(private readonly http: HttpClient) { }

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
