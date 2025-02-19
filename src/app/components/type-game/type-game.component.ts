import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordService } from '../../services/word.service';
import { LeaderboardService } from '../../services/leaderboard.service';
import { LeaderboardEntry } from '../../interfaces/index.interface';

@Component({
  selector: 'app-type-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './type-game.component.html',
  styleUrl: './type-game.component.css'
})

export class TypeGameComponent {
  currentWord = signal<string>('');
  userInput = signal<string>('');
  score = signal<number>(0);
  isGameActive = signal<boolean>(false);
  timeLeft = signal<number>(60);

  playerName = signal<string>('');
  isSubmittingScore = signal<boolean>(false);
  leaderboard = signal<LeaderboardEntry[]>([]);
  showLeaderboard = signal<boolean>(false);

  accuracy = computed(() => {
    const totalAttempts = this.score() + this.mistakes();
    return totalAttempts ? Math.round((this.score() / totalAttempts) * 100) : 0;
  });
  mistakes = signal<number>(0);

  private timer: any;

  constructor(
    private readonly wordService: WordService,
    private readonly leaderboardService: LeaderboardService
  ) { }

  ngOnInit() {
    this.wordService.initializeWordPool().subscribe();
  }

  startGame() {
    this.showLeaderboard.set(false);
    this.isSubmittingScore.set(false);
    this.playerName.set('');

    this.wordService.initializeWordPool().subscribe(() => {
      this.resetGame();
      this.isGameActive.set(true);
      this.nextWord();
      this.startTimer();
    });
  }

  private resetGame() {
    this.score.set(0);
    this.mistakes.set(0);
    this.timeLeft.set(60);
    this.userInput.set('');
    this.currentWord.set('');
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private startTimer() {
    this.timer = setInterval(() => {
      const newTime = this.timeLeft() - 1;
      this.timeLeft.set(newTime);

      if (newTime <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  private endGame() {
    this.isGameActive.set(false);
    clearInterval(this.timer);
  }
  
  playAgain() {
    this.showLeaderboard.set(false);
    this.startGame();
  }

  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.userInput.set(input);

    if (input === this.currentWord()) {
      this.score.update(score => score + 1);
      this.userInput.set('');
      this.nextWord();
    }
  }

  private nextWord() {
    this.currentWord.set(this.wordService.getNextWord());
  }

  checkMistake() {
    const currentInput = this.userInput();
    const targetWord = this.currentWord();

    if (currentInput && !targetWord.startsWith(currentInput)) {
      this.mistakes.update(m => m + 1);
      this.userInput.set('');
    }
  }

  private loadLeaderboard() {
    this.leaderboardService.getScores().subscribe(scores => {
      this.leaderboard.set(scores);
    });
  }

  submitScore() {
    if (this.playerName().length !== 4) {
      return;
    }

    console.log('Submitting score:', {
      name: this.playerName(),
      score: this.score()
    });

    this.isSubmittingScore.set(true);
    this.leaderboardService.addScore(
      this.playerName().toUpperCase(),
      this.score()
    ).subscribe({
      next: (response) => {
        console.log('Score submitted successfully:', response);
        this.isSubmittingScore.set(false);
        this.showLeaderboard.set(true);
        this.loadLeaderboard();
      },
      error: (error) => {
        console.error('Error submitting score:', error);
        this.isSubmittingScore.set(false);
        alert('Error submitting score. Please try again.');
      }
    });
  }

  onNameInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input.length <= 4) {
      this.playerName.set(input.toUpperCase());
    }
  }
}