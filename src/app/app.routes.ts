import { Routes } from '@angular/router';
import { GameSelectorComponent, TypeGameComponent, SnakeGameComponent, PacmanComponent } from './components/index.component';

export const routes: Routes = [
    {
        path: '',
        component: GameSelectorComponent
    },
    {
        path: 'pacman',
        component: PacmanComponent
    },
    {
        path: 'typegame',
        component: TypeGameComponent
    },
    {
        path: 'snakegame',
        component: SnakeGameComponent
    }
];
