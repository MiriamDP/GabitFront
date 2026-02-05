import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HabitService } from '../services/habit.service';
import { Habit, UserStats } from '../interfaces/habit/habit.interface';

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

  // Mapa para guardar progresos fijos y evitar el error NG0100
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
      next: (habitsData: any) => {
        // CORRECCIÓN IMPORTANTE:
        // Como el servicio ya hizo el 'map', 'habitsData' ES DIRECTAMENTE el array.
        // Ya no existe .success ni .data aquí.
        
        console.log('Datos recibidos en Dashboard:', habitsData); // Para depurar

        if (Array.isArray(habitsData)) {
            this.userHabits = habitsData;
            
            // Calculamos estadísticas
            this.stats = this.habitService.getUserStats(this.userHabits);

            // Generamos progresos aleatorios SOLO UNA VEZ al cargar
            this.userHabits.forEach(h => {
                // Usamos 0 por defecto o un random fijo
                this.habitProgress[h.idHabit!] = Math.floor(Math.random() * 100);
            });
        } else {
            // Fallback por si acaso llega el objeto antiguo
            this.userHabits = habitsData.data || [];
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
        // Asegúrate de que la ruta en app-routing.module.ts sea 'habits/:id'
        this.router.navigate(['/habits', habitId]); 
    }
  }

  // CORRECCIÓN NG0100:
  // Ya no llamamos al servicio random cada vez, sino que devolvemos el valor guardado
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
}