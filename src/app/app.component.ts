import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  HeaderComponent,
  GamePreviewComponent,
  TopPlayersComponent,
  FooterComponent
} from './components/index.component';


@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    GamePreviewComponent,
    HeaderComponent,
    FooterComponent,
    GamePreviewComponent,
    TopPlayersComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MiniJuegos';
}
