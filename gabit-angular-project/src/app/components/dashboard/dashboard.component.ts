import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitService } from '../../services/habit.service';

interface UserHabit {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_nombre: string;
  categoria_icono: string;
  color: string;
  total_niveles: number;
  total_niveles_creados: number;
  total_misiones: number;
  fecha_creacion: string;
  es_publico: boolean;
}

interface UserStats {
  totalHabits: number;
  activeHabits: number;
  completedMissions: number;
  totalPoints: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = 'Carmen'; // TODO: Obtener del servicio de autenticación
  userHabits: UserHabit[] = [];
  isLoading = true;
  error: string | null = null;

  stats: UserStats = {
    totalHabits: 0,
    activeHabits: 0,
    completedMissions: 0,
    totalPoints: 0
  };

  constructor(
    private habitService: HabitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserHabits();
  }

  loadUserHabits(): void {
    this.isLoading = true;
    this.error = null;

    this.habitService.getUserHabits().subscribe({
      next: (response) => {
        if (response.success) {
          this.userHabits = response.data;
          this.calculateStats();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar hábitos:', error);
        this.error = 'No se pudieron cargar tus hábitos. Verifica que el servidor esté corriendo.';
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalHabits = this.userHabits.length;
    this.stats.activeHabits = this.userHabits.length; // Por ahora todos son activos
    // TODO: Calcular desde el backend cuando tengamos progreso
    this.stats.completedMissions = this.userHabits.reduce((sum, h) => sum + (h.total_misiones || 0), 0);
    this.stats.totalPoints = 0; // TODO: Calcular desde el backend
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

  getProgressPercentage(habit: UserHabit): number {
    // TODO: Calcular progreso real desde el backend
    // Por ahora devolvemos un valor aleatorio para demostración
    return Math.floor(Math.random() * 100);
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
