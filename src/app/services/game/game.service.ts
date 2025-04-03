import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Game, Genre } from '../../interfaces/index.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  constructor(private readonly http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<{ success: boolean, data: Game[] }>(`${this.baseUrl}/games`).pipe(
      map(response => {
        if (!response?.success || !response?.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching games:', error);
        return of([]);
      })
    );
  }

  getGameById(id: number): Observable<Game | null> {
    return this.http.get<{ success: boolean, data: Game }>(`${this.baseUrl}/games/${id}`).pipe(
      map(response => {
        if (!response?.success || !response?.data) {
          return null;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching game with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<{ success: boolean, data: Genre[] }>(`${this.baseUrl}/genres`).pipe(
      map(response => {
        if (!response?.success || !response?.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching genres:', error);
        return of([]);
      })
    );
  }

  getGamesByGenre(genreId: number): Observable<Game[]> {
    return this.http.get<{ success: boolean, data: Game[] }>(`${this.baseUrl}/genres/${genreId}/games`).pipe(
      map(response => {
        if (!response?.success || !response?.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching games for genre ${genreId}:`, error);
        return of([]);
      })
    );
  }
}
