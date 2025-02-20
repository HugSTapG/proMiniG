import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacmanComponent } from './pacman.component';

describe('PacmanComponent', () => {
  let component: PacmanComponent;
  let fixture: ComponentFixture<PacmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacmanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
