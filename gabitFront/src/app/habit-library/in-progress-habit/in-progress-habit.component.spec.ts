import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressHabitComponent } from './in-progress-habit.component';

describe('InProgressHabitComponent', () => {
  let component: InProgressHabitComponent;
  let fixture: ComponentFixture<InProgressHabitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InProgressHabitComponent]
    });
    fixture = TestBed.createComponent(InProgressHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
