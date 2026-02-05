import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitLevelsComponent } from './habit-levels.component';

describe('HabitLevelsComponent', () => {
  let component: HabitLevelsComponent;
  let fixture: ComponentFixture<HabitLevelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitLevelsComponent]
    });
    fixture = TestBed.createComponent(HabitLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
