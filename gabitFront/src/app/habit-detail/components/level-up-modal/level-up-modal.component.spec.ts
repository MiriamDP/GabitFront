import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelUpModalComponent } from './level-up-modal.component';

describe('LevelUpModalComponent', () => {
  let component: LevelUpModalComponent;
  let fixture: ComponentFixture<LevelUpModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LevelUpModalComponent]
    });
    fixture = TestBed.createComponent(LevelUpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
