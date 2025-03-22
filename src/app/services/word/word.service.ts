import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private readonly BACKUP_WORDS = [
    'typescript',
    'angular',
    'signal',
    'component',
    'template',
    'interface',
    'decorator',
    'injection',
    'directive',
    'pipe'
  ];

  private readonly baseUrl = `${environment.apiBaseUrl}/words`;
  private wordPool: string[] = [];

  constructor(private readonly http: HttpClient) { }

  fetchWords(minLength: number = 4, maxLength: number = 8): Observable<string[]> {
    const url = `${this.baseUrl}?minLength=${minLength}&maxLength=${maxLength}&limit=100`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response?.success || !response?.data) {
          return this.BACKUP_WORDS;
        }
        return response.data;
      }),
      catchError(() => of(this.BACKUP_WORDS))
    );
  }

  initializeWordPool(): Observable<string[]> {
    return this.fetchWords().pipe(
      map(words => {
        this.wordPool = this.shuffleArray([...words]);
        return this.wordPool;
      })
    );
  }

  getNextWord(): Observable<string> {
    if (this.wordPool.length === 0) {
      return this.http.get<any>(`${this.baseUrl}/random`).pipe(
        map(response => {
          if (!response?.success || !response?.data) {
            return this.BACKUP_WORDS[0];
          }
          return response.data;
        }),
        catchError(() => of(this.BACKUP_WORDS[0]))
      );
    }

    return of(this.wordPool.pop() ?? this.BACKUP_WORDS[0]);
  }

  private shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
