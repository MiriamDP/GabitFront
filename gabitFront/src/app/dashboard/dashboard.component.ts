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
      this.userName = user.nombreUsuario || user.nombre || 'Usuario'; 
    }
    this.loadUserHabits();
  }

  /* Ahora no funciona porque no hay api jheje */
  loadUserHabits(): void {
    this.isLoading = true;
    this.error = null;

    this.habitService.getUserHabits().subscribe({
      next: (response) => {
        if (response.success) {
          this.userHabits = response.data;
          this.stats = this.habitService.getUserStats(this.userHabits);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Ha ocurrido un error al cargar tus hábitos. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  getTotalLevels(): number {
    return this.userHabits.reduce((sum, h) => sum + h.total_niveles, 0);
  }

  getHabitsCountText(): string {
    const count = this.userHabits.length;
    return count === 1 ? '1 hábito' : `${count} hábitos`;
  }

  createNewHabit(): void {
    this.router.navigate(['/crear-habito']);
  }

  viewHabitDetails(habitId: number): void {
    // TODO: Navegar a la página de detalles del hábito
    console.log('Ver detalles del hábito:', habitId);
  }

  getProgressPercentage(): number {
    return this.habitService.getProgressPercentage();
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

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

}
