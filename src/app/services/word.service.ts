import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Word {
  word: string;
  score: number;
}

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

  constructor(private readonly http: HttpClient) {}

  // Fetch words from API
  fetchWords(minLength: number = 4, maxLength: number = 8): Observable<string[]> {
    // Datamuse API endpoint - getting words related to 'programming' and 'technology'
    const url = `https://api.datamuse.com/words?ml=programming+technology&max=100`;

    return this.http.get<Word[]>(url).pipe(
      map(response => 
        response
          .map(word => word.word)
          .filter(word => 
            word.length >= minLength && 
            word.length <= maxLength &&
            /^[a-zA-Z]+$/.test(word) // only alphabetical characters
          )
      ),
      catchError(() => of(this.BACKUP_WORDS))
    );
  }

  // Initialize or refresh word pool
  initializeWordPool(): Observable<string[]> {
    return this.fetchWords().pipe(
      map(words => {
        this.wordPool = this.shuffleArray([...words]);
        return this.wordPool;
      })
    );
  }

  // Get next word
  getNextWord(): string {
    if (this.wordPool.length === 0) {
      // If pool is empty, use backup words
      this.wordPool = this.shuffleArray([...this.BACKUP_WORDS]);
    }
    return this.wordPool.pop() ?? this.BACKUP_WORDS[0];
  }

  // Fisher-Yates shuffle algorithm
  private shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}