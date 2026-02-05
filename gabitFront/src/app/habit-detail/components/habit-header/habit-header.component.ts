import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HabitDetail, HabitProgress } from 'src/app/interfaces/habit/habit.interface';

@Component({
  selector: 'app-habit-header',
  templateUrl: './habit-header.component.html',
  styleUrls: ['./habit-header.component.css']
})
export class HabitHeaderComponent {
  @Input() habit!: HabitDetail;
  @Input() progress: HabitProgress | null = null;
  @Output() backClick = new EventEmitter<void>();

  onBackClick(): void {
    this.backClick.emit();
  }

  get progressPercentage(): number {
  return this.progress?.overall_percentage || 0;
}

get currentStreak(): number {
  return this.progress?.current_streak || 0;
}

get bestStreak(): number {
  // Este dato no existe en HabitDetail, necesitas otro endpoint
  return 0;
}

get totalPoints(): number {
  // Este dato no existe en HabitDetail, necesitas otro endpoint
  return 0;
}

get totalLevels(): number {
  return this.habit?.total_levels || 0;
}

get categoryIcon(): string {
  return this.habit?.category_icon || 'circle';
}

}