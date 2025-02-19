import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordService } from '../../services/word.service';
import { LeaderboardEntry, LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'app-type-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './type-game.component.html',
  styleUrl: './type-game.component.css'
})

export class TypeGameComponent {

  // Game state signals
  currentWord = signal<string>('');
  userInput = signal<string>('');
  score = signal<number>(0);
  isGameActive = signal<boolean>(false);
  timeLeft = signal<number>(60);

  // New signals for name input and leaderboard
  playerName = signal<string>('');
  isSubmittingScore = signal<boolean>(false);
  leaderboard = signal<LeaderboardEntry[]>([]);
  showLeaderboard = signal<boolean>(false);

  // Computed values
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
    // Initialize word pool when component loads
    this.wordService.initializeWordPool().subscribe();
  }

  startGame() {
    // Initialize a new word pool when starting a new game
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

    this.isSubmittingScore.set(true);
    this.leaderboardService.addScore(
      this.playerName().toUpperCase(),
      this.score()
    ).subscribe({
      next: () => {
        this.isSubmittingScore.set(false);
        this.showLeaderboard.set(true);
        this.loadLeaderboard();
      },
      error: () => {
        this.isSubmittingScore.set(false);
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