import { Routes } from '@angular/router';
import {
    GameSelectorComponent,
    PacmanMenuComponent,
    PacmanComponent,
    TypeGameComponent
} from './components/index.component';

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
