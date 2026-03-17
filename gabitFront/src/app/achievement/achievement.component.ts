import { Component, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Achievement } from '../interfaces/achievement';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent {
  achievementsCompleted = signal<Achievement[]>([]);
  achievementsIncompleted = signal<Achievement[]>([]);

  constructor(apiSvc: ApiService) {
    apiSvc.getAchievements().subscribe((resp) => {
      const sortedCompleted = [...resp.completed].sort((a, b) => {
        const dateA = a.pivot?.date ? new Date(a.pivot.date).getTime() : 0;
        const dateB = b.pivot?.date ? new Date(b.pivot.date).getTime() : 0;
        return dateB - dateA; // más recientes primero
      });
      this.achievementsCompleted.set(sortedCompleted);
      this.achievementsIncompleted.set(resp.uncompleted);
    });
  }

  // Para darle la vuelta a las tarjetas de completados
  flippedIndex: number | null = null;

  toggleFlip(index: number) {
    this.flippedIndex = this.flippedIndex === index ? null : index;
  }

  // Para darle la vuelta a las tarjetas de pendientes (índice separado)
  flippedIndexPending: number | null = null;

  toggleFlipPending(index: number) {
    this.flippedIndexPending = this.flippedIndexPending === index ? null : index;
  }

  // Devuelve el nombre del hábito al que pertenece el logro
  getAchievementOrigin(achievement: Achievement): string {
    // Asociado directamente al hábito
    if (achievement.habit) {
      return achievement.habit.name;
    }
    // Asociado a un nivel → sacamos el hábito del nivel
    if (achievement.level?.habit) {
      return achievement.level.habit.name;
    }
    // Asociado a una misión → sacamos el hábito a través de misión > nivel
    if (achievement.mission?.level?.habit) {
      return achievement.mission.level.habit.name;
    }
    return "Gabit";
  }

  // Devuelve el detalle de asociación (nivel, misión o hábito completo)
  getAchievementDetail(achievement: Achievement): string {
    if (achievement.mission) {
      return "Misión: " + achievement.mission.name;
    }
    if (achievement.level) {
      return "Nivel " + achievement.level.levelNumber + ": " + achievement.level.name;
    }
    if (achievement.habit) {
      return "Hábito completo";
    }
    return "Sin nivel";
  }
}