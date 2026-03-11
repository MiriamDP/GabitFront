import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HabitService } from '../services/habit.service';
import { Habit, UserStats } from '../interfaces/habit/habit.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userHabits: Habit[] = [];
  isLoading = true;
  error: string | null = null;

  // Progreso de cada hábito, con habitId como clave y porcentaje como valor
  habitProgress: { [key: number]: number } = {};

  stats: UserStats = {
    totalHabits: 0,
    activeHabits: 0,
    completedMissions: 0,
    completedLevels: 0,
    totalPoints: 0,
    longestStreak: 0
  };

  constructor(
    public authService: AuthService,
    private habitService: HabitService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.userName = user.username || 'Usuario';
    }
    this.loadUserHabits();
  }

  loadUserHabits(): void {
    this.isLoading = true;
    this.error = null;

    this.habitService.getUserHabits().subscribe({
      next: (response: any) => {
        console.log("Respuesta del backend:", response);

        if (response.success && response.data) {
          const habitsData = response.data;

          if (Array.isArray(habitsData)) {
            this.userHabits = habitsData;

            // Calculamos estadísticas a partir de los datos del backend
            this.stats = this.habitService.getUserStats(this.userHabits);

            // Cargar progreso REAL de cada hábito
            this.loadHabitsProgress();

            console.log("Hábitos cargados:", this.userHabits);
          } else {
            console.error('La respuesta no contiene un array de hábitos:', habitsData);
            this.userHabits = [];
          }
        } else {
          console.error('Respuesta no exitosa del servidor:', response);
          this.error = 'No se encontraron hábitos activos.';
          this.userHabits = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar hábitos:', error);

        if (error.status === 401) {
          this.error = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (error.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.error = 'No se pudieron cargar tus caminos. Intenta recargar la página.';
        }

        this.isLoading = false;
      }
    });
  }

  loadHabitsProgress(): void {
    // Crear array de observables para cargar progreso de todos los hábitos
    const progressRequests = this.userHabits
      .filter(habit => habit.idHabit !== undefined)
      .map(habit => this.habitService.getHabitProgress(habit.idHabit!));

    // Ejecutar todas las peticiones en paralelo
    if (progressRequests.length > 0) {
      forkJoin(progressRequests).subscribe({
        next: (responses: any[]) => {
          responses.forEach((response, index) => {
            const habitId = this.userHabits[index].idHabit;
            if (habitId && response.success && response.data) {
              this.habitProgress[habitId] = response.data.overall_percentage || 0;
            }
          });
          console.log("Progreso de hábitos cargado:", this.habitProgress);
        },
        error: (error) => {
          console.error("Error al cargar progreso de hábitos:", error);
          // Si falla, ponemos 0 en todos
          this.userHabits.forEach(habit => {
            if (habit.idHabit) {
              this.habitProgress[habit.idHabit] = 0;
            }
          });
        }
      });
    }
  }

  getHabitsCountText(): string {
    const count = this.userHabits.length;
    return count === 1 ? '1 camino' : `${count} caminos`;
  }

  createNewHabit(): void {
    this.router.navigate(['/crear-habito']);
  }

  viewHabitDetails(habitId: number | undefined): void {
    if (habitId) {
      this.router.navigate(['/habits', habitId]);
    }
  }

  getProgressPercentage(habitId: number | undefined): number {
    if (!habitId) return 0;
    return this.habitProgress[habitId] || 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

  getCurrentLevelPercentage(habit: Habit): number {
    const total = habit.current_level_missions ?? 0;
    const completed = habit.current_level_completed ?? 0;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  getMissionsRemaining(habit: Habit): number {
    const total = habit.current_level_missions ?? 0;
    const completed = habit.current_level_completed ?? 0;
    return Math.max(0, total - completed);
  }
}