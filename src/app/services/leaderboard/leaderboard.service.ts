import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { LeaderboardEntry } from '../../interfaces/index.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private readonly baseUrl = `${environment.apiBaseUrl}/leaderboard`;

  constructor(private readonly http: HttpClient) { }

  addScore(name: string, score: number): Observable<any> {
    return this.http.post(this.baseUrl, { name, score }).pipe(
      catchError(error => {
        console.error('Error in addScore:', error);
        throw error;
      })
    );
  }

  getScores(): Observable<LeaderboardEntry[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => {
        if (!response?.success || !response?.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error in getScores:', error);
        return of([]);
      })
    );
  }
}
