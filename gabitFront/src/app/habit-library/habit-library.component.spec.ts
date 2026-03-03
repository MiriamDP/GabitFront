import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitLibraryComponent } from './habit-library.component';

describe('HabitLibraryComponent', () => {
  let component: HabitLibraryComponent;
  let fixture: ComponentFixture<HabitLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitLibraryComponent]
    });
    fixture = TestBed.createComponent(HabitLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
