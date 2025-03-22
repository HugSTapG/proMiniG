import { Routes } from '@angular/router';
import { GameSelectorComponent, TypeGameComponent, SnakeGameComponent } from './components/index.component';

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
        path: 'snakegame',
        component: SnakeGameComponent
    }
];
