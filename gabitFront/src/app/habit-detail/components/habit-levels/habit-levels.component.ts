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


  onLevelClick(level: Level): void {
    // Si el nivel está bloqueado, no hacemos nada
    if (!this.isLevelUnlocked(level)) {
      return;
    }
    this.levelSelected.emit(level);
  }

  //Comprobamos si el nivel está desbloqueado (si es el primer nivel o si el nivel anterior está completado)
  isLevelUnlocked(level: Level): boolean {

    if (level.levelNumber === 1) return true;
    const previousLevel = this.levels.find(l => l.levelNumber === level.levelNumber - 1);
    return previousLevel?.completed ?? false;
  }

  // Comprobamos si el nivel es el seleccionado actualmente para la interfaz
  isLevelSelected(level: Level): boolean {
    return this.selectedLevel?.idLevel === level.idLevel;
  }

  // Comprobamos si el nivel es el nivel actual del usuario (para interfaz)
  isCurrentLevel(level: Level): boolean {
    return level.levelNumber === this.currentLevel;
  }

  // --- CÁLCULO DE PROGRESO ---
  getLevelProgress(level: Level): number {
    if (level.completed) return 100;
    
    // Si no hay misiones, no hay progreso (o es 0%)
    if (!level.missions || level.missions.length === 0) return 0;

    // 1. Calcular Puntos Totales del Nivel (Suma de los puntos de todas las misiones)
    const totalPoints = level.missions.reduce((sum, mission) => sum + (mission.points || 0), 0);

    // Evitar división por cero
    if (totalPoints === 0) return 0;

    // 2. Calcular Puntos Obtenidos 
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
    if (this.isCurrentLevel(level)) return 'Zap';
    return '';
  }

  getLevelStatusClass(level: Level): string {
    if (level.completed) return 'completed';
    if (!this.isLevelUnlocked(level)) return 'locked';
    if (this.isCurrentLevel(level)) return 'current';
    return 'unlocked';
  }
}