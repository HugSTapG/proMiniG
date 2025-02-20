import { Routes } from '@angular/router';
import { GameSelectorComponent } from './components/index.component';
import { TypeGameComponent } from './components/type-game/type-game.component';
import { PacmanComponent } from './components/Pacman-game/pacman.component';
import { PacmanMenuComponent } from './components/pacman-menu/pacman-menu.component';

export const routes: Routes = [
    {
        path: '',
        component: GameSelectorComponent
    },
    {
        path: 'typegame',
        component: TypeGameComponent
    },
    {
        path: 'pacman',
        component: PacmanComponent
    },
    {
        path: 'pacman-menu',
        component: PacmanMenuComponent
    }
];
