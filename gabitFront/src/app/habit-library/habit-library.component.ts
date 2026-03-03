import { Component } from '@angular/core';
import { Habit, UserStats } from '../interfaces/habit/habit.interface';
import { AuthService } from '../services/auth.service';
import { HabitService } from '../services/habit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-habit-library',
  templateUrl: './habit-library.component.html',
  styleUrls: ['./habit-library.component.css']
})
export class HabitLibraryComponent {
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
    totalPoints: 0,
    longestStreak: 0
  };

  constructor(
    public authService: AuthService,
    private habitService: HabitService,
    private router: Router
  ) {}

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
        const habitsData = response.data;
        if (Array.isArray(habitsData)) {
          this.userHabits = habitsData;
          
          // Calculamos estadísticas
          this.stats = this.habitService.getUserStats(this.userHabits);

          // Generamos progresos aleatorios mockeados
          this.userHabits.forEach(h => {
            if (h.idHabit) {
              this.habitProgress[h.idHabit] = Math.floor(Math.random() * 100);
            }
          });
        } else {
          console.error('La respuesta no contiene un array de hábitos:', habitsData);
          this.userHabits = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar hábitos:', error);
        this.error = 'No se pudieron cargar tus caminos. Intenta recargar la página.';
        this.isLoading = false;
      }
    });
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

  deleteHabit(){
    console.log("Click en borrar")
  }

  pausedHabit(){
    console.log("Pausar habito")
  }
}
