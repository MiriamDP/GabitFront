import { Component, Input } from '@angular/core';
import { Level } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.component.html',
  styleUrls: ['./level-detail.component.css']
})
export class LevelDetailComponent {
  @Input() level: Level | null = null;

  // Estado del nivel
  get isLevelCompleted(): boolean {
    return this.level?.completed ?? false;
  }

  get levelStatus(): 'completed' | 'in-progress' | 'not-started' {
    if (this.isLevelCompleted) return 'completed';
    if (this.completedMissions > 0) return 'in-progress';
    return 'not-started';
  }

  // Misiones (Si se completan todas, el nivel se marca como completado)
  get totalMissions(): number {
    return this.level?.missions?.length || 0;
  }

  get completedMissions(): number {
    if (!this.level?.missions) return 0;
    return this.level.missions.filter(m => m.completed).length;
  }

  get missionsCompletionText(): string {
    if (this.totalMissions === 0) return 'Sin misiones';
    return `${this.completedMissions} de ${this.totalMissions}`;
  }

  // Puntos (SOLO VISUAL)
  get currentPoints(): number {
    if (!this.level?.missions) return 0;
    return this.level.missions
      .filter(m => m.completed)
      .reduce((sum, mission) => sum + (mission.points || 0), 0);
  }

  get totalPoints(): number {
    if (!this.level?.missions) return 0;
    return this.level.missions
      .reduce((sum, mission) => sum + (mission.points || 0), 0);
  }

  // Progreso (BASADO EN MISIONES)
  get completionPercentage(): number {
    if (this.totalMissions === 0) return 0;
    if (this.isLevelCompleted) return 100;
    
    return Math.round((this.completedMissions / this.totalMissions) * 100);
  }

  // Mensajes para UI
  get statusMessage(): string {
    if (this.isLevelCompleted) {
      return 'Nivel completado';
    }
    
    const remaining = this.totalMissions - this.completedMissions;
    if (remaining === 1) {
      return 'Solo falta 1 misión';
    }
    
    return `Faltan ${remaining} misiones para completar`;
  }

  get statusIcon(): string {
    if (this.isLevelCompleted) return 'CheckCircle2';
    if (this.completedMissions > 0) return 'Zap';
    return 'Info';
  }
}