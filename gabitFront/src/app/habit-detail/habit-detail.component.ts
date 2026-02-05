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

    // Cargar detalle del hábito (incluye niveles y misiones)
    this.habitService.getHabitDetail(habitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (habitDetail) => {
          this.habitDetail = habitDetail;
          
          // Seleccionar el nivel actual o el primero disponible
          this.selectedLevel = this.findCurrentLevel(habitDetail.niveles, habitDetail.nivel_actual);
          
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
    return levels.find(l => l.numero_nivel === currentLevelNumber) || levels[0] || null;
  }

  onLevelSelected(level: Level): void {
    // Verificar si el nivel está desbloqueado
    const previousLevel = this.habitDetail?.niveles.find(
      l => l.numero_nivel === level.numero_nivel - 1
    );
    
    const isUnlocked = this.habitService.isLevelUnlocked(level, previousLevel);
    
    if (!isUnlocked) {
      // Mostrar mensaje de nivel bloqueado
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
            this.reloadHabitLevels(this.habitDetail.id);
          }
        },
        error: (err) => {
          console.error('Error al completar misión:', err);
        }
      });
  }

  private updateMissionInList(updatedMission: Mission): void {
    if (!this.selectedLevel) return;

    const missionIndex = this.selectedLevel.misiones.findIndex(
      m => m.id === updatedMission.id
    );

    if (missionIndex !== -1) {
      this.selectedLevel.misiones[missionIndex] = updatedMission;
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
            this.habitDetail.niveles = habitDetail.niveles;
            this.habitDetail.nivel_actual = habitDetail.nivel_actual;
            
            // Actualizar nivel seleccionado si es necesario
            const updatedLevel = habitDetail.niveles.find(
              l => l.id === this.selectedLevel?.id
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

  // Getters para el template
  get completedMissionsCount(): number {
    if (!this.selectedLevel) return 0;
    return this.habitService.getCompletedMissionsCount(this.selectedLevel.misiones);
  }

  get totalMissionsCount(): number {
    return this.selectedLevel?.misiones.length || 0;
  }

  get levelProgress(): number {
    if (!this.selectedLevel) return 0;
    return this.habitService.calculateLevelProgress(this.selectedLevel);
  }
}