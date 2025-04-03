import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../interfaces/index.interface';

@Component({
  selector: 'app-game-selector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.css']
})
export class GameSelectorComponent implements OnInit {
  private readonly gameService = inject(GameService);

  games = signal<Game[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.isLoading.set(true);
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.games.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error in component while loading games', err);
        this.error.set('Failed to load games. Please try again later.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  getButtonClass(index: number): string {
    const buttonClasses = [
      'btn-outline-warning',
      'btn-outline-info',
      'btn-outline-success'
    ];
    return buttonClasses[index % buttonClasses.length];
  }

  getRouterPath(gameName: string): string {
    const routeMap: Record<string, string> = {
      'snake': 'snakegame',
      'pacman': 'pacmangame',
      'type game': 'typegame'
    };

    return routeMap[gameName.toLowerCase()] || '';
  }
}
