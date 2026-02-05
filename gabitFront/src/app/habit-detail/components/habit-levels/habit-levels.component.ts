import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Level } from 'src/app/interfaces/habit/habit.interface';

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
    // Verificar si el nivel está desbloqueado
    if (!this.isLevelUnlocked(level)) {
      return;
    }
    
    this.levelSelected.emit(level);
  }

  isLevelUnlocked(level: Level): boolean {
    // El nivel 1 siempre está desbloqueado
    if (level.numero_nivel === 1) return true;
    
    // Verificar si el nivel anterior está completado
    const previousLevel = this.levels.find(
      l => l.numero_nivel === level.numero_nivel - 1
    );
    
    return previousLevel?.completado ?? false;
  }

  isLevelSelected(level: Level): boolean {
    return this.selectedLevel?.id === level.id;
  }

  isCurrentLevel(level: Level): boolean {
    return level.numero_nivel === this.currentLevel;
  }

  getLevelProgress(level: Level): number {
    if (level.completado) return 100;
    if (level.puntos_requeridos === 0) return 0;
    
    return Math.min(
      (level.puntos_actuales / level.puntos_requeridos) * 100,
      100
    );
  }

  getLevelStatusIcon(level: Level): string {
    if (level.completado) return '✓';
    if (!this.isLevelUnlocked(level)) return '🔒';
    if (this.isCurrentLevel(level)) return '▶';
    return '';
  }

  getLevelStatusClass(level: Level): string {
    if (level.completado) return 'completed';
    if (!this.isLevelUnlocked(level)) return 'locked';
    if (this.isCurrentLevel(level)) return 'current';
    return 'unlocked';
  }
}