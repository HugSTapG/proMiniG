import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { ScoreSubmissionService } from '../../services/index.service';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})

export class SnakeGameComponent implements OnInit, AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private readonly GRID_SIZE = 20;
  private readonly GAME_SPEED = 110;

  private snake: { x: number, y: number }[] = [];
  private food: { x: number, y: number } = { x: 0, y: 0 };
  private direction: string = 'right';
  private nextDirection: string = 'right';
  private gameLoopInterval: any;

  public score = signal<number>(0);
  public currentScore = signal<number>(0);
  public playerInitials = signal<string>('');

  public gameOver = signal<boolean>(false);
  public gameStarted = signal<boolean>(false);
  public showInitialScreen = signal<boolean>(true);
  public showPlayerNameEntry = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public submitError = signal<string>('');

  constructor(
    private readonly scoreSubmissionService: ScoreSubmissionService
  ) { }

  ngOnInit(): void {
    // Init
  }

  ngAfterViewInit(): void {
    this.setupCanvas();
  }

  public isValidInitials(): boolean {
    const initials = this.playerInitials();
    if (initials.length !== 4) return false;
    return /^[A-Z]{4}$/.test(initials);
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 200);
    const gridCount = Math.floor(maxSize / this.GRID_SIZE);

    canvas.width = gridCount * this.GRID_SIZE;
    canvas.height = gridCount * this.GRID_SIZE;

    this.drawInitialScreen();
  }

  public showPlayerEntry(): void {
    this.showInitialScreen.set(false);
    this.showPlayerNameEntry.set(true);
  }

  public startGameWithName(): void {
    if (!this.isValidInitials()) {
      return;
    }

    this.showPlayerNameEntry.set(false);
    this.startGame();
  }

  public startGame(): void {
    this.gameStarted.set(true);
    this.gameOver.set(false);
    this.score.set(0);
    this.currentScore.set(0);

    this.snake = [
      { x: 6 * this.GRID_SIZE, y: 10 * this.GRID_SIZE },
      { x: 5 * this.GRID_SIZE, y: 10 * this.GRID_SIZE },
      { x: 4 * this.GRID_SIZE, y: 10 * this.GRID_SIZE }
    ];

    this.direction = 'right';
    this.nextDirection = 'right';

    this.placeFood();

    this.gameLoopInterval = setInterval(() => this.gameLoop(), this.GAME_SPEED);
  }

  public playAgain(): void {
    this.submitScoreAndRestart();
  }

  public changePlayer(): void {
    this.submitScoreAndShowNameEntry();
  }

  private gameLoop(): void {
    this.moveSnake();

    if (this.checkCollision()) {
      this.endGame();
      return;
    }

    this.checkFood();
    this.draw();
  }

  private moveSnake(): void {
    this.direction = this.nextDirection;

    const head = { x: this.snake[0].x, y: this.snake[0].y };

    switch (this.direction) {
      case 'up':
        head.y -= this.GRID_SIZE;
        break;
      case 'down':
        head.y += this.GRID_SIZE;
        break;
      case 'left':
        head.x -= this.GRID_SIZE;
        break;
      case 'right':
        head.x += this.GRID_SIZE;
        break;
    }

    this.snake.unshift(head);

    if (head.x !== this.food.x || head.y !== this.food.y) {
      this.snake.pop();
    }
  }

  private checkCollision(): boolean {
    const head = this.snake[0];
    const canvas = this.canvasRef.nativeElement;

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= canvas.width ||
      head.y >= canvas.height
    ) {
      return true;
    }

    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }

    return false;
  }

  private checkFood(): void {
    const head = this.snake[0];

    if (head.x === this.food.x && head.y === this.food.y) {
      const newScore = this.score() + 10;
      this.score.set(newScore);
      this.currentScore.set(newScore);
      this.placeFood();
    }
  }

  private placeFood(): void {
    const canvas = this.canvasRef.nativeElement;
    const gridCountX = canvas.width / this.GRID_SIZE;
    const gridCountY = canvas.height / this.GRID_SIZE;

    while (true) {
      const x = Math.floor(Math.random() * gridCountX) * this.GRID_SIZE;
      const y = Math.floor(Math.random() * gridCountY) * this.GRID_SIZE;

      let collision = false;
      for (const segment of this.snake) {
        if (segment.x === x && segment.y === y) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        this.food = { x, y };
        break;
      }
    }
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;

    this.ctx.fillStyle = '#2C3E50';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += this.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += this.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(canvas.width, y);
      this.ctx.stroke();
    }

    for (let i = 0; i < this.snake.length; i++) {
      const segment = this.snake[i];

      if (i === 0) {
        this.ctx.fillStyle = '#E74C3C';
      } else {
        const ratio = i / this.snake.length;
        const r = Math.floor(46 - (ratio * 46));
        const g = Math.floor(204 - (ratio * 120));
        const b = Math.floor(113 + (ratio * 142));
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      }

      this.roundRect(
        this.ctx,
        segment.x + 1,
        segment.y + 1,
        this.GRID_SIZE - 2,
        this.GRID_SIZE - 2,
        5
      );
    }

    const pulseSize = Math.sin(Date.now() / 150) * 2;
    this.ctx.fillStyle = '#F1C40F';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x + this.GRID_SIZE / 2,
      this.food.y + this.GRID_SIZE / 2,
      this.GRID_SIZE / 2 - 1 + pulseSize,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Player: ${this.playerInitials()}`, 10, 25);
    this.ctx.fillText(`Score: ${this.score()}`, 10, 50);
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  private drawInitialScreen(): void {
    const canvas = this.canvasRef.nativeElement;

    this.ctx.fillStyle = '#2C3E50';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SNAKE GAME', canvas.width / 2, canvas.height / 3);

    this.ctx.font = '16px Arial';
    this.ctx.fillText('Use arrow keys or WASD to move', canvas.width / 2, canvas.height / 2);
    this.ctx.fillText('Collect food to grow and score points', canvas.width / 2, canvas.height / 2 + 30);
    this.ctx.fillText('Avoid hitting walls or yourself', canvas.width / 2, canvas.height / 2 + 60);
    this.ctx.fillText('Press Space or click Start Game', canvas.width / 2, canvas.height / 2 + 100);

    this.ctx.textAlign = 'left';
  }

  private drawGameOverScreen(): void {
    const canvas = this.canvasRef.nativeElement;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);

    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Player: ${this.playerInitials()}`, canvas.width / 2, canvas.height / 2 - 30);
    this.ctx.fillText(`Score: ${this.currentScore()}`, canvas.width / 2, canvas.height / 2);

    this.ctx.textAlign = 'left';
  }

  private endGame(): void {
    clearInterval(this.gameLoopInterval);
    this.gameOver.set(true);
    this.gameStarted.set(false);
    this.drawGameOverScreen();
  }

  private submitScoreAndRestart(): void {
    this.isLoading.set(true);
    this.submitError.set('');

    this.scoreSubmissionService.submitScore(this.playerInitials(), this.currentScore()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.startGame();
      },
      error: (error) => {
        console.error('Failed to submit score:', error);
        this.submitError.set('Failed to submit score. Please try again.');
        this.isLoading.set(false);
        this.startGame();
      }
    });
  }

  private submitScoreAndShowNameEntry(): void {
    this.isLoading.set(true);
    this.submitError.set('');

    this.scoreSubmissionService.submitScore(this.playerInitials(), this.currentScore()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.playerInitials.set('');
        this.gameOver.set(false);
        this.showPlayerNameEntry.set(true);
      },
      error: (error) => {
        console.error('Failed to submit score:', error);
        this.submitError.set('Failed to submit score. Please try again.');
        this.isLoading.set(false);
        this.playerInitials.set('');
        this.gameOver.set(false);
        this.showPlayerNameEntry.set(true);
      }
    });
  }

  public mobileControl(direction: string): void {
    if (this.gameOver()) {
      return;
    }

    switch (direction) {
      case 'up':
        if (this.direction !== 'down') {
          this.nextDirection = 'up';
        }
        break;
      case 'down':
        if (this.direction !== 'up') {
          this.nextDirection = 'down';
        }
        break;
      case 'left':
        if (this.direction !== 'right') {
          this.nextDirection = 'left';
        }
        break;
      case 'right':
        if (this.direction !== 'left') {
          this.nextDirection = 'right';
        }
        break;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.showPlayerNameEntry()) {
      return;
    }

    if (this.showInitialScreen() && event.code === 'Space') {
      this.showPlayerEntry();
      return;
    }

    if (this.gameOver()) {
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        if (this.direction !== 'down') {
          this.nextDirection = 'up';
        }
        break;
      case 'ArrowDown':
      case 'KeyS':
        if (this.direction !== 'up') {
          this.nextDirection = 'down';
        }
        break;
      case 'ArrowLeft':
      case 'KeyA':
        if (this.direction !== 'right') {
          this.nextDirection = 'left';
        }
        break;
      case 'ArrowRight':
      case 'KeyD':
        if (this.direction !== 'left') {
          this.nextDirection = 'right';
        }
        break;
    }
  }

  updateInitials(value: string): void {
    this.playerInitials.set(value.toUpperCase());
  }
}
