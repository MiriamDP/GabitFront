import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
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

  showLevelUpModal = false;
  showAchievementModal = false;
  newAchievements: Achievement[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public habitService: HabitService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const habitId = Number(params['id']);
      this.loadHabitData(habitId);
    });
    
    this.subscribeToProgress();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHabitData(habitId: number): void {
    this.loading = true;

    if (!habitId || isNaN(habitId)) {
      this.error = 'ID de hábito no válido';
      this.loading = false;
      return;
    }

    this.habitService.getHabitDetail(habitId).subscribe({
      next: (response) => {
        this.habitDetail = response.data;
        
        if (this.habitDetail) {
          this.selectedLevel = this.findCurrentLevel(
            this.habitDetail.levels, 
            this.habitDetail.current_level
          );
        }
        
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
    this.habitService.getHabitProgress(habitId).subscribe({
      next: (response) => {
        this.progress = response.data;
      },
      error: (err) => {
        console.error('Error al cargar progreso:', err);
      }
    });
  }

  private subscribeToProgress(): void {
    this.habitService.getCurrentProgress().subscribe(progress => {
      if (progress) {
        this.progress = progress;
      }
    });
  }

  private findCurrentLevel(levels: Level[], currentLevelNumber: number): Level | null {
    return levels.find(l => l.levelNumber === currentLevelNumber) || levels[0] || null;
  }

  onLevelSelected(level: Level): void {
    const previousLevel = this.habitDetail?.levels.find(
      l => l.levelNumber === level.levelNumber - 1
    );
    
    const isUnlocked = this.habitService.isLevelUnlocked(level, previousLevel);
    
    if (!isUnlocked) {
      return;
    }

    this.selectedLevel = level;
  }


  onMissionComplete(missionId: number): void {
    this.habitService.completeMission(missionId).subscribe({
      next: (response) => {
        const { mission, progress, levelUp, achievements } = response.data;
        
        this.updateMissionInList(mission);
        this.progress = progress;

        if (levelUp) {
          this.handleLevelUp();
        }

        if (achievements && achievements.length > 0) {
          this.handleNewAchievements(achievements);
        }

        if (this.habitDetail) {
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
    this.habitService.getHabitDetail(habitId).subscribe({
      next: (response) => {
        const habitDetail: HabitDetail = response.data;
        
        if (this.habitDetail && habitDetail) {
          this.habitDetail.levels = habitDetail.levels;
          this.habitDetail.current_level = habitDetail.current_level;
          
          const updatedLevel = habitDetail.levels?.find(
            (l: Level) => l.idLevel === this.selectedLevel?.idLevel
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

  get completedMissionsCount(): number {
    if (!this.selectedLevel) return 0;
    return this.habitService.getCompletedMissionsCount(this.selectedLevel.missions);
  }

  get totalMissionsCount(): number {
    return this.selectedLevel?.missions.length || 0;
  }

  get levelProgress(): number {
    if (!this.selectedLevel) return 0;
    return this.habitService.calculateLevelProgress(this.selectedLevel);
  }
}