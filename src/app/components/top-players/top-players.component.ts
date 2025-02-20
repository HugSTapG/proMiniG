import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { LeaderboardService } from '../../services/index.service';
import { LeaderboardEntry } from '../../interfaces/index.interface';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-top-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-players.component.html',
  styleUrls: ['./top-players.component.css'],
  animations: [
    trigger('playerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class TopPlayersComponent implements OnInit, OnDestroy {
  topPlayers: LeaderboardEntry[] = [];
  private refreshSubscription?: Subscription;

  constructor(private readonly leaderboardService: LeaderboardService) { }

  ngOnInit() {
    this.refreshSubscription = interval(30000).pipe(
      startWith(0),
      switchMap(() => this.leaderboardService.getScores())
    ).subscribe(scores => {
      const sortedScores = scores.toSorted((a, b) => b.score - a.score);
      this.topPlayers = sortedScores.slice(0, 3);
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}