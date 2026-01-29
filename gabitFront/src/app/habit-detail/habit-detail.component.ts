import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from '../services/habit.service';
import { HabitDetail, Level, Mission } from '../interfaces/habit/habit.interface';



@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.css']
})
export class HabitDetailComponent implements OnInit {
  habitId!: number;
  habit: HabitDetail | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.habitId = +params['id'];
      this.loadHabitDetails();
    });
  }

  loadHabitDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.habitService.getHabitById(this.habitId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.habit = response.data;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar hábito:', error);
        this.error = 'No se pudo cargar el hábito';
        this.isLoading = false;
      }
    });
  }

  getCurrentLevel(): Level | null {
    if (!this.habit || !this.habit.niveles) return null;
    return this.habit.niveles.find(l => l.numero_nivel === this.habit!.nivel_actual) || null;
  }

  getNextLevel(): Level | null {
    if (!this.habit || !this.habit.niveles) return null;
    return this.habit.niveles.find(l => l.numero_nivel === this.habit!.nivel_actual + 1) || null;
  }

  getProgressPercentage(level: Level): number {
    if (!level || level.puntos_requeridos === 0) return 0;
    return Math.min(100, (level.puntos_actuales / level.puntos_requeridos) * 100);
  }

  getMissionProgressPercentage(mission: Mission): number {
    if (!mission || mission.requisito === 0) return 0;
    return Math.min(100, (mission.progreso_actual / mission.requisito) * 100);
  }

  completeMission(mission: Mission): void {
    if (mission.completada) return;
    
    // TODO: Llamar a la API para marcar como completada
    console.log('Completar misión:', mission.id);
    
    // Mock temporal
    mission.completada = true;
    mission.progreso_actual = mission.requisito;
    
    if (this.habit) {
      this.habit.puntos_totales += mission.puntos;
      const currentLevel = this.getCurrentLevel();
      if (currentLevel) {
        currentLevel.puntos_actuales += mission.puntos;
        
        // Verificar si sube de nivel
        if (currentLevel.puntos_actuales >= currentLevel.puntos_requeridos) {
          currentLevel.completado = true;
          this.habit.nivel_actual++;
          this.showLevelUpAnimation();
        }
      }
    }
  }

  showLevelUpAnimation(): void {
    alert('¡Felicidades! ¡Has subido de nivel! 🎉');
  }

  getMissionTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'diaria': 'Diaria',
      'semanal': 'Semanal',
      'unica': 'Única'
    };
    return types[type] || type;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  }
}