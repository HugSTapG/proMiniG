import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacmanMenuComponent } from './pacman-menu.component';

describe('PacmanMenuComponent', () => {
  let component: PacmanMenuComponent;
  let fixture: ComponentFixture<PacmanMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacmanMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacmanMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
