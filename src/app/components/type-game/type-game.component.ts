import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaderboardEntry } from '../../interfaces/index.interface';
import {
  WordService,
  TimerService,
  LeaderboardService,
  TypeGameStateService,
  ScoreSubmissionService
} from '../../services/index.service';

@Component({
  selector: 'app-type-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './type-game.component.html',
  styleUrl: './type-game.component.css'
})
export class TypeGameComponent {
  userInput = signal<string>('');
  playerName = signal<string>('');
  isSubmittingScore = signal<boolean>(false);
  showLeaderboard = signal<boolean>(false);
  leaderboard = signal<LeaderboardEntry[]>([]);

  private readonly gameState: ReturnType<TypeGameStateService['getGameState']>;

  isGameActive = computed(() => this.gameState.isGameActive());
  currentWord = computed(() => this.gameState.currentWord());
  score = computed(() => this.gameState.score());
  timeLeft = computed(() => this.gameState.timeLeft());
  accuracy = computed(() => {
    const totalAttempts = this.score() + this.gameState.mistakes();
    return totalAttempts ? Math.round((this.score() / totalAttempts) * 100) : 0;
  });

  constructor(
    private readonly wordService: WordService,
    private readonly typeGameStateService: TypeGameStateService,
    private readonly timerService: TimerService,
    private readonly scoreSubmissionService: ScoreSubmissionService,
    private readonly leaderboardService: LeaderboardService
  ) {
    this.gameState = this.typeGameStateService.getGameState();
  }

  startGame() {
    this.showLeaderboard.set(false);
    this.isSubmittingScore.set(false);
    this.playerName.set('');

    this.wordService.initializeWordPool().subscribe(() => {
      this.typeGameStateService.resetGame();
      this.gameState.isGameActive.set(true);
      this.nextWord();
      this.timerService.startTimer(this.gameState.timeLeft, () => this.endGame());
    });
  }

  private nextWord() {
    const nextWord = this.wordService.getNextWord();
    this.gameState.currentWord.set(nextWord);
  }

  private endGame() {
    this.gameState.isGameActive.set(false);
    this.timerService.stopTimer();
  }

  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.userInput.set(input);

    if (input === this.gameState.currentWord()) {
      this.gameState.score.update(score => score + 1);
      this.userInput.set('');
      this.nextWord();
    }
  }

  checkMistake() {
    const currentInput = this.userInput();
    const targetWord = this.gameState.currentWord();
    if (currentInput && !targetWord.startsWith(currentInput)) {
      this.gameState.mistakes.update(m => m + 1);
      this.userInput.set('');
    }
  }

  onNameInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input.length <= 4) {
      this.playerName.set(input.toUpperCase());
    }
  }

  playAgain() {
    this.showLeaderboard.set(false);
    this.startGame();
  }

  submitScore() {
    if (this.playerName().length !== 4) return;

    this.isSubmittingScore.set(true);
    this.scoreSubmissionService.submitScore(this.playerName(), this.score())
      .subscribe({
        next: () => {
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

  private loadLeaderboard() {
    this.leaderboardService.getScores().subscribe(scores => {
      this.leaderboard.set(scores);
    });
  }
}