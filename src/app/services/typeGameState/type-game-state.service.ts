import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypeGameStateService {
  private readonly currentWord: WritableSignal<string> = signal('');
  private readonly score: WritableSignal<number> = signal(0);
  private readonly isGameActive: WritableSignal<boolean> = signal(false);
  private readonly timeLeft: WritableSignal<number> = signal(60);
  private readonly mistakes: WritableSignal<number> = signal(0);

  getGameState() {
    return {
      currentWord: this.currentWord,
      score: this.score,
      isGameActive: this.isGameActive,
      timeLeft: this.timeLeft,
      mistakes: this.mistakes
    };
  }

  resetGame() {
    this.score.set(0);
    this.mistakes.set(0);
    this.timeLeft.set(60);
    this.currentWord.set('');
  }
}