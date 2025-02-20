import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Word } from '../../interfaces/index.interface';
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

  private wordPool: string[] = [];

  constructor(private readonly http: HttpClient) { }

  fetchWords(minLength: number = 4, maxLength: number = 8): Observable<string[]> {
    const url = `${environment.datamuseApi}?ml=programming+technology&max=100`;

    return this.http.get<Word[]>(url).pipe(
      map(response =>
        response
          .map(word => word.word)
          .filter(word =>
            word.length >= minLength &&
            word.length <= maxLength &&
            /^[a-zA-Z]+$/.test(word)
          )
      ),
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

  getNextWord(): string {
    if (this.wordPool.length === 0) {
      this.wordPool = this.shuffleArray([...this.BACKUP_WORDS]);
    }
    return this.wordPool.pop() ?? this.BACKUP_WORDS[0];
  }

  private shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
