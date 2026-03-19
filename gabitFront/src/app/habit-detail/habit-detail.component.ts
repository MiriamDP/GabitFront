import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { HabitService } from 'src/app/services/habit.service';
import { HabitDetail, Level, HabitProgress, Achievement } from 'src/app/interfaces/habit/habit.interface';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.css']
})
export class HabitDetailComponent implements OnInit {

  private destroyRef = inject(DestroyRef); // Para manejar la destrucción del componente y evitar fugas de memoria
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public habitService = inject(HabitService);

  habitDetail: HabitDetail | null = null;
  selectedLevel: Level | null = null;
  progress: HabitProgress | null = null;
  
  loading = true;
  error: string | null = null;
  showLevelUpModal = false;
  showAchievementModal = false;
  newAchievements: Achievement[] = [];

  ngOnInit(): void {
    this.route.params.pipe(
      //Aqui obtenemos el id del habito desde la url, cargamos el progreso y luego el detalle del habito
      switchMap(params => {
        const habitId = Number(params['id']);
        this.loading = true;
        this.loadProgress(habitId);
        return this.habitService.getHabitDetail(habitId);
      }),
      // Aseguramos que la suscripción se cancele automáticamente cuando el componente se destruya, por ejemplo, 
      // al navegar a otra página u a otro nivel del mismo habito, evitando así posibles fugas de memoria.
      takeUntilDestroyed(this.destroyRef) 
    ).subscribe({
      next: (response) => {
        this.habitDetail = response.data;
        if (this.habitDetail) {
          const found = this.findCurrentLevel(this.habitDetail.levels, this.habitDetail.current_level);
          this.selectedLevel = found ? { ...found } : null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle:', err);
        this.error = 'Error al cargar el hábito';
        this.loading = false;
      }
    });

    this.subscribeToGlobalProgress();
  }

  private loadProgress(habitId: number): void {
    this.habitService.getHabitProgress(habitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.progress = response.data,
        error: (err) => console.error('Error al cargar progreso:', err)
      });
  }

  private subscribeToGlobalProgress(): void {
    this.habitService.getCurrentProgress()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(progress => {
        if (progress) this.progress = progress;
      });
  }

  private findCurrentLevel(levels: Level[], currentLevelNumber: number): Level | null {
    return levels.find(l => l.levelNumber === currentLevelNumber) || levels[0] || null;
  }

  onLevelSelected(level: Level): void {
    if (level.levelNumber !== 1) {
      const previousLevel = this.habitDetail?.levels.find(
        l => l.levelNumber === level.levelNumber - 1
      );
      if (!previousLevel?.completed) return;
    }
    this.selectedLevel = { ...level };
  }

  onMissionComplete(missionId: number): void {
    this.habitService.completeMission(missionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const { progress, level_up, unlocked_achievements } = response.data;

          this.markMissionAsCompleted(missionId);
          this.progress = progress;

          if (level_up) {
            this.markCurrentLevelCompleted();
            this.showLevelUpModal = true;
          }

          if (unlocked_achievements?.length > 0) {
            this.newAchievements = unlocked_achievements;
            this.showAchievementModal = true;
          }
        },
        error: (err) => console.error('Error al completar misión:', err)
      });
  }

  private markMissionAsCompleted(missionId: number): void {
    if (!this.habitDetail) return;

    this.habitDetail.levels = this.habitDetail.levels.map(level => {
      const missionIndex = level.missions.findIndex(m => m.idMission === missionId);
      if (missionIndex === -1) return level;

      const updatedMissions = [...level.missions];
      updatedMissions[missionIndex] = { ...updatedMissions[missionIndex], completed: true };
      
      const updatedLevel = { ...level, missions: updatedMissions };

      if (this.selectedLevel?.idLevel === level.idLevel) {
        this.selectedLevel = updatedLevel;
      }

      return updatedLevel;
    });
  }

  private markCurrentLevelCompleted(): void {
    if (!this.habitDetail || !this.selectedLevel) return;

    this.habitDetail.levels = this.habitDetail.levels.map(level => {
      if (level.idLevel === this.selectedLevel!.idLevel) {
        const completedLevel = { ...level, completed: true };
        this.selectedLevel = completedLevel;
        return completedLevel;
      }
      return level;
    });

    this.habitDetail = {
      ...this.habitDetail,
      current_level: this.habitDetail.current_level + 1
    };
  }

  onCloseLevelUpModal(): void {
    this.showLevelUpModal = false;
  }

  onCloseAchievementModal(): void {
    this.showAchievementModal = false;
    this.newAchievements = [];
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}