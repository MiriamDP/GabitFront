import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  Habit, 
  HabitDetail, 
  HabitProgress, 
  Category, 
  UserStats, 
  Level, 
  Mission, 
  Achievement 
} from '../interfaces/habit/habit.interface';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = 'http://localhost:8000/api';
  private currentHabitProgress$ = new BehaviorSubject<HabitProgress | null>(null);

  constructor(private http: HttpClient) { }

  // ============================
  // HÁBITOS BÁSICOS
  // ============================

  /**
   * Crear un nuevo hábito
   */
  createHabit(habit: Habit | any): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits/crear`, habit);
  }

  /**
   * Obtener hábitos del usuario
   */
  getUserHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits`);
  }

  /**
   * Obtener un hábito específico
   */
  getHabitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits/leer/${id}`);
  }

  /**
   * Obtener detalle completo de un hábito con niveles y misiones
   * TODO: Crear endpoint en Laravel: GET /api/habits/detalle/{id}
   */
  getHabitDetail(habitId: number): Observable<HabitDetail> {
    return this.http.get<HabitDetail>(`${this.apiUrl}/habits/detalle/${habitId}`);
  }

  /**
   * Obtener hábitos públicos
   */
  getPublicHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/leer`);
  }

  /**
   * Actualizar un hábito
   */
  updateHabit(id: number, habit: Partial<Habit>): Observable<any> {
    return this.http.put(`${this.apiUrl}/habits/actualizar/${id}`, habit);
  }

  // ============================
  // PROGRESO
  // ============================

  /**
   * Obtener progreso del usuario en un hábito
   * TODO: Crear endpoint en Laravel: GET /api/habits/{id}/progreso
   */
  getHabitProgress(habitId: number): Observable<HabitProgress> {
    return this.http.get<HabitProgress>(
      `${this.apiUrl}/habits/${habitId}/progreso`
    ).pipe(
      tap(progress => this.currentHabitProgress$.next(progress))
    );
  }

  /**
   * Observable del progreso actual
   */
  getCurrentProgress(): Observable<HabitProgress | null> {
    return this.currentHabitProgress$.asObservable();
  }

  // ============================
  // MISIONES
  // ============================

  /**
   * Actualizar progreso de una misión
   * TODO: Crear endpoint en Laravel: POST /api/misiones/{id}/actualizar-progreso
   */
  updateMissionProgress(
    misionId: number, 
    incremento: number = 1
  ): Observable<{ mission: Mission, progress: HabitProgress, levelUp?: boolean }> {
    return this.http.post<{ mission: Mission, progress: HabitProgress, levelUp?: boolean }>(
      `${this.apiUrl}/misiones/${misionId}/actualizar-progreso`,
      { incremento }
    ).pipe(
      tap(response => {
        this.currentHabitProgress$.next(response.progress);
      })
    );
  }

  /**
   * Completar una misión
   * TODO: Crear endpoint en Laravel: POST /api/misiones/{id}/completar
   */
  completeMission(
    misionId: number
  ): Observable<{ 
    mission: Mission, 
    progress: HabitProgress, 
    levelUp?: boolean, 
    achievements?: Achievement[] 
  }> {
    return this.http.post<{
      mission: Mission,
      progress: HabitProgress,
      levelUp?: boolean,
      achievements?: Achievement[]
    }>(
      `${this.apiUrl}/misiones/${misionId}/completar`,
      {}
    ).pipe(
      tap(response => {
        this.currentHabitProgress$.next(response.progress);
      })
    );
  }

  /**
   * Reiniciar progreso de una misión (solo para diarias/semanales)
   * TODO: Crear endpoint en Laravel: POST /api/misiones/{id}/reiniciar
   */
  resetMission(misionId: number): Observable<Mission> {
    return this.http.post<Mission>(
      `${this.apiUrl}/misiones/${misionId}/reiniciar`,
      {}
    );
  }

  // ============================
  // LOGROS
  // ============================

  /**
   * Obtener logros desbloqueados de un hábito
   * TODO: Crear endpoint en Laravel: GET /api/habits/{id}/logros
   */
  getHabitAchievements(habitId: number): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(
      `${this.apiUrl}/habits/${habitId}/logros`
    );
  }

  // ============================
  // CATEGORÍAS
  // ============================

  /**
   * Obtener categorías
   */
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/leer`);
  }

  // ============================
  // ESTADÍSTICAS Y HELPERS
  // ============================

  /**
   * Calcular estadísticas del usuario
   */
  getUserStats(habits: Habit[]): UserStats {
    return {
      totalHabits: habits.length,
      activeHabits: habits.filter(h => h.activo).length,
      completedMissions: habits.reduce((sum, h) => sum + (h.total_misiones || 0), 0),
      totalPoints: 0, // TODO: Obtener del backend
      longestStreak: 0 // TODO: Obtener del backend
    };
  }

  /**
   * Helper: Calcular progreso de un nivel
   */
  calculateLevelProgress(level: Level): number {
    if (level.completado) return 100;
    if (level.puntos_requeridos === 0) return 0;
    
    return Math.min(
      (level.puntos_actuales / level.puntos_requeridos) * 100,
      100
    );
  }

  /**
   * Helper: Verificar si un nivel está desbloqueado
   */
  isLevelUnlocked(level: Level, previousLevel?: Level): boolean {
    // El nivel 1 siempre está desbloqueado
    if (level.numero_nivel === 1) return true;
    
    // Los demás niveles requieren que el anterior esté completado
    return previousLevel?.completado ?? false;
  }

  /**
   * Helper: Obtener siguiente misión disponible en un nivel
   */
  getNextAvailableMission(missions: Mission[]): Mission | null {
    return missions.find(m => !m.completada) || null;
  }

  /**
   * Helper: Calcular total de misiones completadas en un nivel
   */
  getCompletedMissionsCount(missions: Mission[]): number {
    return missions.filter(m => m.completada).length;
  }

  /**
   * Helper: Formatear tipo de misión para mostrar
   */
  getMissionTypeLabel(tipo: Mission['tipo']): string {
    const labels = {
      'diaria': 'Misión diaria',
      'semanal': 'Misión semanal',
      'unica': 'Misión única'
    };
    return labels[tipo];
  }

  /**
   * Helper: Verificar si una misión puede reiniciarse
   */
  canResetMission(mission: Mission): boolean {
    return (mission.tipo === 'diaria' || mission.tipo === 'semanal') && mission.completada;
  }

  /**
   * Generar progreso mock para demostración
   */
  getProgressPercentage(): number {
    return Math.floor(Math.random() * 100);
  }
}