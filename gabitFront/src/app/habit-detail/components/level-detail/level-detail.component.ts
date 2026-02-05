import { Component, Input } from '@angular/core';
import { Level } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.component.html',
  styleUrls: ['./level-detail.component.css']
})
export class LevelDetailComponent {
  @Input() level: Level | null = null;

  // --- ESTADO DEL NIVEL ---

  get isLevelCompleted(): boolean {
    return this.level?.completed ?? false;
  }

  // --- CÁLCULO DE PUNTOS (Sumando las misiones) ---

  get currentPoints(): number {
    if (!this.level?.missions) return 0;
    // Sumamos los puntos solo de las misiones completadas
    return this.level.missions
      .filter(m => m.completed)
      .reduce((sum, mission) => sum + (mission.points || 0), 0);
  }

  get requiredPoints(): number {
    if (!this.level?.missions) return 0;
    // Sumamos los puntos de TODAS las misiones del nivel
    return this.level.missions
      .reduce((sum, mission) => sum + (mission.points || 0), 0);
  }

  get remainingPoints(): number {
    return Math.max(0, this.requiredPoints - this.currentPoints);
  }

  // --- CÁLCULO DE MISIONES Y PROGRESO ---

  get totalMissions(): number {
    return this.level?.missions?.length || 0;
  }

  get completedMissions(): number {
    if (!this.level?.missions) return 0;
    return this.level.missions.filter(m => m.completed).length;
  }

  get completionPercentage(): number {
    if (this.totalMissions === 0) return 0;
    if (this.isLevelCompleted) return 100;

    // Calculamos el porcentaje basado en los puntos (más preciso)
    if (this.requiredPoints > 0) {
      return Math.round((this.currentPoints / this.requiredPoints) * 100);
    }
    
    // Fallback: Si no hay puntos, calculamos por número de misiones
    return Math.round((this.completedMissions / this.totalMissions) * 100);
  }

  get missionsCompletionText(): string {
    if (this.totalMissions === 0) return 'Sin misiones';
    return `${this.completedMissions} de ${this.totalMissions} misiones completadas`;
  }
}