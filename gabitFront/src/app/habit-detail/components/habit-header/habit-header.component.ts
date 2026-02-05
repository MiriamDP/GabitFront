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

  get overallProgress(): number {
    if (!this.progress) return 0;
    return this.progress.progreso_porcentaje;
  }

  get streakDays(): number {
    return this.habit?.racha_dias || 0;
  }

  get bestStreak(): number {
    return this.habit?.mejor_racha || 0;
  }

  get totalPoints(): number {
    return this.habit?.puntos_totales || 0;
  }

  get currentLevel(): number {
    return this.habit?.nivel_actual || 1;
  }

  get totalLevels(): number {
    return this.habit?.total_niveles || 0;
  }
}