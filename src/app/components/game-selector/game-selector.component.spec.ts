import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSelectorComponent } from './game-selector.component';

describe('GameSelectorComponent', () => {
  let component: GameSelectorComponent;
  let fixture: ComponentFixture<GameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
