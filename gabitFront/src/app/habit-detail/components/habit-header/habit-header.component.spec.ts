import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitHeaderComponent } from './habit-header.component';

describe('HabitHeaderComponent', () => {
  let component: HabitHeaderComponent;
  let fixture: ComponentFixture<HabitHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitHeaderComponent]
    });
    fixture = TestBed.createComponent(HabitHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
