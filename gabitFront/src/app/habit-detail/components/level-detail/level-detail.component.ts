import { Component, Input } from '@angular/core';
import { Level } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.component.html',
  styleUrls: ['./level-detail.component.css']
})
export class LevelDetailComponent {
  @Input() level!: Level;
  @Input() completedMissions: number = 0;
  @Input() totalMissions: number = 0;
  @Input() progressPercentage: number = 0;

  get isLevelCompleted(): boolean {
    return this.level?.completado ?? false;
  }

  get currentPoints(): number {
    return this.level?.puntos_actuales ?? 0;
  }

  get requiredPoints(): number {
    return this.level?.puntos_requeridos ?? 0;
  }

  get remainingPoints(): number {
    return Math.max(0, this.requiredPoints - this.currentPoints);
  }

  get completionPercentage(): number {
    return Math.round(this.progressPercentage);
  }

  get missionsCompletionText(): string {
    return `${this.completedMissions} de ${this.totalMissions} misiones completadas`;
  }
}