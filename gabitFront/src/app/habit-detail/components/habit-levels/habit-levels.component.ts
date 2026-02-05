import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Level, Mission } from 'src/app/interfaces/habit/habit.interface';

@Component({
  selector: 'app-habit-levels',
  templateUrl: './habit-levels.component.html',
  styleUrls: ['./habit-levels.component.css']
})
export class HabitLevelsComponent {
  @Input() levels: Level[] = [];
  @Input() currentLevel: number = 1;
  @Input() selectedLevel: Level | null = null;
  @Output() levelSelected = new EventEmitter<Level>();

  // --- MÉTODO QUE FALTABA Y CAUSABA EL ERROR ---
  onLevelClick(level: Level): void {
    // Si el nivel está bloqueado, no hacemos nada
    if (!this.isLevelUnlocked(level)) {
      return;
    }
    // Emitimos el evento al padre
    this.levelSelected.emit(level);
  }

  isLevelUnlocked(level: Level): boolean {
    // CORRECCIÓN: levelNumber (inglés)
    if (level.levelNumber === 1) return true;
    
    // CORRECCIÓN: levelNumber (inglés)
    const previousLevel = this.levels.find(l => l.levelNumber === level.levelNumber - 1);
    
    // CORRECCIÓN: completed (inglés)
    return previousLevel?.completed ?? false;
  }

  isLevelSelected(level: Level): boolean {
    // CORRECCIÓN: idLevel (inglés - Primary Key)
    return this.selectedLevel?.idLevel === level.idLevel;
  }

  isCurrentLevel(level: Level): boolean {
    // CORRECCIÓN: levelNumber (inglés)
    return level.levelNumber === this.currentLevel;
  }

  // --- CÁLCULO DE PROGRESO (Basado en Misiones) ---
  getLevelProgress(level: Level): number {
    if (level.completed) return 100;
    
    // Si no hay misiones, no hay progreso (o es 0%)
    if (!level.missions || level.missions.length === 0) return 0;

    // 1. Calcular Puntos Totales del Nivel (Suma de los puntos de todas las misiones)
    const totalPoints = level.missions.reduce((sum, mission) => sum + (mission.points || 0), 0);

    // Evitar división por cero
    if (totalPoints === 0) return 0;

    // 2. Calcular Puntos Obtenidos (Suma de puntos de misiones completadas)
    const earnedPoints = level.missions
      .filter(mission => mission.completed) 
      .reduce((sum, mission) => sum + (mission.points || 0), 0);
    
    return Math.min((earnedPoints / totalPoints) * 100, 100);
  }

  // Helper para mostrar texto en el HTML (ej: "50 / 100")
  getLevelPointsText(level: Level): string {
    if (!level.missions) return '0 / 0';
    
    const totalPoints = level.missions.reduce((sum, m) => sum + (m.points || 0), 0);
    const earnedPoints = level.missions
      .filter(m => m.completed)
      .reduce((sum, m) => sum + (m.points || 0), 0);

    return `${earnedPoints} / ${totalPoints}`;
  }

  getLevelStatusIcon(level: Level): string {
    if (level.completed) return '✓';
    if (!this.isLevelUnlocked(level)) return 'Lock';
    if (this.isCurrentLevel(level)) return 'Play';
    return '';
  }

  getLevelStatusClass(level: Level): string {
    if (level.completed) return 'completed';
    if (!this.isLevelUnlocked(level)) return 'locked';
    if (this.isCurrentLevel(level)) return 'current';
    return 'unlocked';
  }
}