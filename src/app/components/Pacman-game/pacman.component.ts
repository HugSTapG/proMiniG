import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacman',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacman.component.html',
  styleUrls: ['./pacman.component.css']
})
export class PacmanComponent implements OnInit, AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  isBrowser = false;

  tileSize = 20;
  pacmanSpeed = 2;
  ghostSpeed = 2;
  powerUpDuration = 5000;
  mouthAngle = 0;
  mouthSpeed = 0.1;
  blink = false;
  score = 0;
  lives = 3;
  panicMode = false;
  panicTimer = 0;
  playerName = '';
  showNameInput = true;
  gameState: 'playing' | 'gameover' | 'win' = 'playing';

  map: number[][] = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  pacman = { x: 1 * 20 + 10, y: 1 * 20 + 10, dx: 0, dy: 0, desiredDx: 0, desiredDy: 0 };

  ghosts = [
    { x: 10 * 20 + 10, y: 5 * 20 + 10, dx: this.ghostSpeed, dy: 0, type: 'blinky' },
    { x: 15 * 20 + 10, y: 5 * 20 + 10, dx: 0, dy: this.ghostSpeed, type: 'random' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
      this.gameLoop();
    }
  }

  startGame() {
    if (!this.playerName.trim()) return;
    this.showNameInput = false;
    this.resetGame();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isBrowser || this.showNameInput) return;
    if (this.gameState !== 'playing') return;
    switch(event.key) {
      case 'ArrowUp': this.pacman.desiredDx = 0; this.pacman.desiredDy = -this.pacmanSpeed; break;
      case 'ArrowDown': this.pacman.desiredDx = 0; this.pacman.desiredDy = this.pacmanSpeed; break;
      case 'ArrowLeft': this.pacman.desiredDx = -this.pacmanSpeed; this.pacman.desiredDy = 0; break;
      case 'ArrowRight': this.pacman.desiredDx = this.pacmanSpeed; this.pacman.desiredDy = 0; break;
    }
  }

  gameLoop() {
    if (!this.isBrowser) return;
    requestAnimationFrame(() => this.gameLoop());
    if (this.showNameInput) return;
    if (this.gameState !== 'playing') { this.draw(); return; }
    this.mouthAngle += this.mouthSpeed;
    if (this.mouthAngle > 1 || this.mouthAngle < 0) this.mouthSpeed *= -1;
    if (this.panicMode) this.blink = Math.floor(Date.now() / 250) % 2 === 0;
    this.update();
    this.draw();
  }

  update() {
    if (this.panicMode && Date.now() > this.panicTimer) this.panicMode = false;
    this.updatePacman();
    this.updateGhosts();
    this.checkCollisions();
    this.checkWinCondition();
  }

  updatePacman() {
    if (this.pacman.x % this.tileSize === 10 && this.pacman.y % this.tileSize === 10) {
      const col = Math.floor(this.pacman.x / this.tileSize);
      const row = Math.floor(this.pacman.y / this.tileSize);
      if (this.canMove(col, row, this.pacman.desiredDx, this.pacman.desiredDy)) {
        this.pacman.dx = this.pacman.desiredDx;
        this.pacman.dy = this.pacman.desiredDy;
      }
      if (this.map[row][col] === 0) { this.map[row][col] = 2; this.score += 10; }
      if (this.map[row][col] === 3) { this.map[row][col] = 2; this.panicMode = true; this.panicTimer = Date.now() + this.powerUpDuration; this.score += 50; }
      if (!this.canMove(col, row, this.pacman.dx, this.pacman.dy)) {
        this.pacman.dx = 0; this.pacman.dy = 0;
      }
    }
    this.pacman.x += this.pacman.dx;
    this.pacman.y += this.pacman.dy;
  }

  updateGhosts() {
    for (let ghost of this.ghosts) {
        const col = Math.floor(ghost.x / this.tileSize);
        const row = Math.floor(ghost.y / this.tileSize);

        if (ghost.x % this.tileSize === 10 && ghost.y % this.tileSize === 10) {
            let dirs = [
                { dx: this.ghostSpeed, dy: 0 },
                { dx: -this.ghostSpeed, dy: 0 },
                { dx: 0, dy: this.ghostSpeed },
                { dx: 0, dy: -this.ghostSpeed }
            ].filter(d => this.canMove(col, row, d.dx, d.dy));

            // ✅ Si no hay alternativas, permitimos girar atrás (no quedarse congelado)
            if (dirs.length === 0) {
                dirs = [
                    { dx: this.ghostSpeed, dy: 0 },
                    { dx: -this.ghostSpeed, dy: 0 },
                    { dx: 0, dy: this.ghostSpeed },
                    { dx: 0, dy: -this.ghostSpeed }
                ]; // Recupera todas
            }

            if (ghost.type === 'blinky') {
                dirs.sort((a, b) => {
                    const dx = Math.sign(this.pacman.x - ghost.x) * this.ghostSpeed;
                    const dy = Math.sign(this.pacman.y - ghost.y) * this.ghostSpeed;
                    return (Math.abs(b.dx - dx) + Math.abs(b.dy - dy)) - (Math.abs(a.dx - dx) + Math.abs(a.dy - dy));
                });
            } else {
                dirs.sort(() => Math.random() - 0.5);
            }

            if (dirs.length > 0) {
                ghost.dx = dirs[0].dx;
                ghost.dy = dirs[0].dy;
            }
        }

        ghost.x += ghost.dx;
        ghost.y += ghost.dy;
    }
}


  checkCollisions() {
    for (let ghost of this.ghosts) {
      const dx = ghost.x - this.pacman.x;
      const dy = ghost.y - this.pacman.y;
      if (Math.sqrt(dx * dx + dy * dy) < this.tileSize / 2) {
        if (this.panicMode) {
          ghost.x = 10 * this.tileSize + 10;
          ghost.y = 5 * this.tileSize + 10;
          this.score += 200;
        } else {
          this.lives--;
          if (this.lives <= 0) this.gameState = 'gameover';
          else this.resetPlayer();
        }
      }
    }
  }

  checkWinCondition() {
    const remaining = this.map.flat().filter(cell => cell === 0 || cell === 3).length;
    if (remaining === 0) this.gameState = 'win';
  }

  resetPlayer() {
    this.pacman.x = 1 * this.tileSize + 10;
    this.pacman.y = 1 * this.tileSize + 10;
    this.pacman.dx = this.pacman.dy = 0;
  }

  resetGame() {
    this.map = this.map.map(row => row.map(cell => (cell === 2 ? 0 : cell)));
    this.score = 0;
    this.lives = 3;
    this.gameState = 'playing';
    this.resetPlayer();
  }

  canMove(col: number, row: number, dx: number, dy: number): boolean {
    const tCol = col + Math.sign(dx);
    const tRow = row + Math.sign(dy);
    return this.map[tRow]?.[tCol] !== 1;
  }

  draw() {
    this.ctx.clearRect(0, 0, 400, 200);
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        const cell = this.map[y][x];
        if (cell === 1) {
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        } else if (cell === 0 || cell === 3) {
          this.ctx.fillStyle = cell === 3 ? 'orange' : 'white';
          this.ctx.beginPath();
          this.ctx.arc(x * this.tileSize + 10, y * this.tileSize + 10, 3, 0, 2 * Math.PI);
          this.ctx.fill();
        }
      }
    }

    const angle = (0.25 + 0.15 * this.mouthAngle) * Math.PI;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pacman.x, this.pacman.y);
    this.ctx.arc(this.pacman.x, this.pacman.y, 8, angle, 2 * Math.PI - angle);
    this.ctx.lineTo(this.pacman.x, this.pacman.y);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();

    for (let ghost of this.ghosts) {
      this.ctx.beginPath();
      this.ctx.arc(ghost.x, ghost.y, 8, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.panicMode ? (this.blink ? 'white' : 'lightblue') : (ghost.type === 'blinky' ? 'red' : 'pink');
      this.ctx.fill();
    }

    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px monospace';
    this.ctx.fillText(`${this.playerName} | Score: ${this.score} | Lives: ${this.lives}`, 10, 195);

    if (this.gameState === 'gameover') {
      this.ctx.fillStyle = 'red';
      this.ctx.font = '20px monospace';
      this.ctx.fillText('GAME OVER', 140, 100);
    }

    if (this.gameState === 'win') {
      this.ctx.fillStyle = 'lime';
      this.ctx.font = '20px monospace';
      this.ctx.fillText('YOU WIN!', 150, 100);
    }
  }
}
