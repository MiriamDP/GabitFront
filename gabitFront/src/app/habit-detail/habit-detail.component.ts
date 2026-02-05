import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HabitService } from 'src/app/services/habit.service';
import { HabitDetail, Level, Mission, HabitProgress, Achievement } from 'src/app/interfaces/habit/habit.interface';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.css']
})
export class HabitDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  habitDetail: HabitDetail | null = null;
  selectedLevel: Level | null = null;
  progress: HabitProgress | null = null;
  loading = true;
  error: string | null = null;

  // Estado para animaciones y notificaciones
  showLevelUpModal = false;
  showAchievementModal = false;
  newAchievements: Achievement[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public habitService: HabitService
  ) {}

  ngOnInit(): void {
    this.loadHabitData();
    this.subscribeToProgress();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHabitData(): void {
    this.loading = true;
    const habitId = Number(this.route.snapshot.paramMap.get('id'));

    if (!habitId || isNaN(habitId)) {
      this.error = 'ID de hábito no válido';
      this.loading = false;
      return;
    }

    // Cargar detalle del hábito
    this.habitService.getHabitDetail(habitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (habitDetail) => {
          this.habitDetail = habitDetail;
          
          // CORRECCIÓN: levels y current_level
          this.selectedLevel = this.findCurrentLevel(habitDetail.levels, habitDetail.current_level);
          
          // Cargar progreso
          this.loadProgress(habitId);
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el hábito';
          console.error(err);
          this.loading = false;
        }
      });
  }

  private loadProgress(habitId: number): void {
    this.habitService.getHabitProgress(habitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (progress) => {
          this.progress = progress;
        },
        error: (err) => {
          console.error('Error al cargar progreso:', err);
        }
      });
  }

  private subscribeToProgress(): void {
    this.habitService.getCurrentProgress()
      .pipe(takeUntil(this.destroy$))
      .subscribe(progress => {
        if (progress) {
          this.progress = progress;
        }
      });
  }

  private findCurrentLevel(levels: Level[], currentLevelNumber: number): Level | null {
    // CORRECCIÓN: l.levelNumber
    return levels.find(l => l.levelNumber === currentLevelNumber) || levels[0] || null;
  }

  onLevelSelected(level: Level): void {
    // Verificar si el nivel está desbloqueado
    // CORRECCIÓN: habitDetail.levels y l.levelNumber
    const previousLevel = this.habitDetail?.levels.find(
      l => l.levelNumber === level.levelNumber - 1
    );
    
    const isUnlocked = this.habitService.isLevelUnlocked(level, previousLevel);
    
    if (!isUnlocked) {
      // Opcional: Mostrar mensaje de nivel bloqueado
      return;
    }

    this.selectedLevel = level;
  }

  onMissionProgress(event: { missionId: number, increment: number }): void {
    this.habitService.updateMissionProgress(event.missionId, event.increment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ mission, progress, levelUp }) => {
          this.updateMissionInList(mission);
          this.progress = progress;

          if (levelUp) {
            this.handleLevelUp();
          }
        },
        error: (err) => {
          console.error('Error al actualizar progreso de misión:', err);
        }
      });
  }

  onMissionComplete(missionId: number): void {
    this.habitService.completeMission(missionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ mission, progress, levelUp, achievements }) => {
          this.updateMissionInList(mission);
          this.progress = progress;

          if (levelUp) {
            this.handleLevelUp();
          }

          if (achievements && achievements.length > 0) {
            this.handleNewAchievements(achievements);
          }

          // Recargar el hábito para actualizar los niveles
          if (this.habitDetail) {
            // CORRECCIÓN: Usar idHabit
            this.reloadHabitLevels(this.habitDetail.idHabit);
          }
        },
        error: (err) => {
          console.error('Error al completar misión:', err);
        }
      });
  }

  private updateMissionInList(updatedMission: Mission): void {
    if (!this.selectedLevel) return;

    // CORRECCIÓN: missions y idMission
    const missionIndex = this.selectedLevel.missions.findIndex(
      m => m.idMission === updatedMission.idMission
    );

    if (missionIndex !== -1) {
      this.selectedLevel.missions[missionIndex] = updatedMission;
    }
  }

  private handleLevelUp(): void {
    this.showLevelUpModal = true;
  }

  private handleNewAchievements(achievements: Achievement[]): void {
    this.newAchievements = achievements;
    this.showAchievementModal = true;
  }

  private reloadHabitLevels(habitId: number): void {
    this.habitService.getHabitDetail(habitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (habitDetail) => {
          if (this.habitDetail) {
            // CORRECCIÓN: levels y current_level
            this.habitDetail.levels = habitDetail.levels;
            this.habitDetail.current_level = habitDetail.current_level;
            
            // Actualizar nivel seleccionado si es necesario
            // CORRECCIÓN: levels y idLevel
            const updatedLevel = habitDetail.levels.find(
              l => l.idLevel === this.selectedLevel?.idLevel
            );
            if (updatedLevel) {
              this.selectedLevel = updatedLevel;
            }
          }
        },
        error: (err) => {
          console.error('Error al recargar niveles:', err);
        }
      });
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

  // Getters para el template (aunque el HTML ya no usa algunos, es bueno mantenerlos actualizados)
  get completedMissionsCount(): number {
    if (!this.selectedLevel) return 0;
    // CORRECCIÓN: missions
    return this.habitService.getCompletedMissionsCount(this.selectedLevel.missions);
  }

  get totalMissionsCount(): number {
    // CORRECCIÓN: missions
    return this.selectedLevel?.missions.length || 0;
  }

  get levelProgress(): number {
    if (!this.selectedLevel) return 0;
    return this.habitService.calculateLevelProgress(this.selectedLevel);
  }
}