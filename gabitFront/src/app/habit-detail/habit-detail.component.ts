import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
    public habitService: HabitService,
    private cdr: ChangeDetectorRef
  ) { }

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
    this.habitService.getHabitDetail(habitId).subscribe({
      next: (response) => {
        this.habitDetail = response.data;

        if (this.habitDetail) {
          console.log('LEVELS:', this.habitDetail.levels.map((l: any) => ({
            id: l.idLevel,
            num: l.levelNumber,
            completed: l.completed,
            missions: l.missions.length
          })));
          console.log('current_level:', this.habitDetail.current_level);

          const found = this.findCurrentLevel(this.habitDetail.levels, this.habitDetail.current_level);
          this.selectedLevel = found ? { ...found } : null;
          console.log('selectedLevel tras asignación:', this.selectedLevel?.levelNumber, this.selectedLevel?.missions?.length, 'misiones');
        }

        this.loadProgress(habitId);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar el hábito';
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


  showContent = true;
  onLevelSelected(level: Level): void {
    // 1. Si no es el nivel 1, comprobamos que el anterior esté completado
    //    Si no lo está, bloqueamos el acceso y salimos
    if (level.levelNumber !== 1) {
      const previousLevel = this.habitDetail?.levels.find(
        l => l.levelNumber === level.levelNumber - 1
      );
      if (!previousLevel?.completed) return;
    }

    // 2. Ocultamos el contenido (app-level-detail y app-mission-list desaparecen del DOM)
    //    Esto fuerza a Angular a DESTRUIR los componentes hijo
    this.showContent = false;

    // 3. Actualizamos selectedLevel con una copia nueva del nivel clickado
    //    El spread {...level} crea una nueva referencia de objeto
    this.selectedLevel = { ...level };

    // 4. Forzamos que Angular procese el showContent = false ahora mismo
    this.cdr.detectChanges();

    // 5. Después de 10ms (un ciclo de Angular), volvemos a mostrar el contenido
    //    Angular ahora RECREA los componentes hijo desde cero con el nuevo nivel
    //    y los renderiza correctamente con los datos actualizados
    setTimeout(() => {
      this.showContent = true;
      this.cdr.detectChanges(); // Forzamos que Angular procese el showContent = true
    }, 10);

    // Este proceso de ocultar y mostrar es un truco para forzar a Angular a destruir y recrear los 
    // componentes hijo (app-level-detail y app-mission-list) cada vez que se selecciona un nivel diferente.
    // Sin esto, Angular no detecta correctamente los cambios en selectedLevel y no actualiza la vista como debería.
  }

  onMissionComplete(missionId: number): void {
    this.habitService.completeMission(missionId).subscribe({
      next: (response) => {
        const { progress, level_up, unlocked_achievements } = response.data;

        // Actualizamos la misión como completada directamente en memoria,
        // sin llamada extra al backend, para que la UI responda inmediatamente
        this.markMissionAsCompleted(missionId);

        // Actualizamos el progreso general
        this.progress = progress;

        // Si todas las misiones del nivel están completadas, marcamos el nivel como completado
        // y desbloqueamos el siguiente
        if (level_up) {
          this.markCurrentLevelCompleted();
          this.handleLevelUp();
        }

        if (unlocked_achievements?.length > 0) {
          this.handleNewAchievements(unlocked_achievements);
        }

        // Forzamos detección de cambios para que Angular actualice la vista
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al completar misión:', err);
      }
    });
  }

  // Marca la misión como completada en el array en memoria,
  // reemplazando el objeto con una nueva referencia para que Angular lo detecte
  private markMissionAsCompleted(missionId: number): void {
    if (!this.habitDetail) return;

    this.habitDetail.levels = this.habitDetail.levels.map(level => {
      const missionIndex = level.missions.findIndex(m => m.idMission === missionId);

      if (missionIndex === -1) return level;

      // Creamos nuevas referencias para que Angular detecte el cambio
      const updatedMissions = [...level.missions];
      updatedMissions[missionIndex] = { ...updatedMissions[missionIndex], completed: true };

      const updatedLevel = { ...level, missions: updatedMissions };

      // Si el nivel seleccionado es este, actualizamos también selectedLevel
      if (this.selectedLevel?.idLevel === level.idLevel) {
        this.selectedLevel = updatedLevel;
      }

      return updatedLevel;
    });
  }

  // Marca el nivel actual como completado y avanza current_level en habitDetail
  private markCurrentLevelCompleted(): void {
    if (!this.habitDetail || !this.selectedLevel) return;

    this.habitDetail.levels = this.habitDetail.levels.map(level => {
      if (level.idLevel === this.selectedLevel!.idLevel) {
        const completedLevel = { ...level, completed: true };
        // Actualizamos también selectedLevel con la nueva referencia
        this.selectedLevel = completedLevel;
        return completedLevel;
      }
      return level;
    });

    // Avanzamos el current_level en el habitDetail
    this.habitDetail = {
      ...this.habitDetail,
      current_level: this.habitDetail.current_level + 1
    };
  }

  private handleLevelUp(): void {
    this.showLevelUpModal = true;
  }

  private handleNewAchievements(achievements: Achievement[]): void {
    this.newAchievements = achievements;
    this.showAchievementModal = true;
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