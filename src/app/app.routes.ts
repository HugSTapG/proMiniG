import { Routes } from '@angular/router';
import { GameSelectorComponent } from './components/index.component';
import { TypeGameComponent } from './components/type-game/type-game.component';


export const routes: Routes = [
    {
        path: '',
        component: GameSelectorComponent
    },
    {
        path: 'typegame',
        component: TypeGameComponent
    }
];
