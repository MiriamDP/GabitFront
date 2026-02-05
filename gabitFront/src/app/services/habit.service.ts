import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators'; // Importamos map
import { 
  Habit, 
  HabitDetail, 
  HabitProgress, 
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

  // ==========================================
  // 1. ENDPOINTS DE HÁBITOS (API)
  // ==========================================

  getUserHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits`).pipe(
      // Desempaquetamos 'data' para que el Dashboard reciba el array directamente
      map((res: any) => res.data) 
    );
  }

  createHabit(habit: Habit | any): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits`, habit).pipe(
      map((res: any) => res.data)
    );
  }

  getHabitDetail(habitId: number): Observable<HabitDetail> {
    return this.http.get<any>(`${this.apiUrl}/habits/${habitId}/detail`).pipe(
      // Desempaquetamos 'data' para arreglar el error del 'find' en el componente
      map(res => res.data) 
    );
  }

  getHabitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits/${id}`).pipe(
      map((res: any) => res.data)
    );
  }

  updateHabit(id: number, habit: Partial<Habit>): Observable<any> {
    return this.http.put(`${this.apiUrl}/habits/${id}`, habit).pipe(
      map((res: any) => res.data)
    );
  }

  getPublicHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/habits`).pipe(
      map((res: any) => res.data)
    );
  }

  // ==========================================
  // 2. ENDPOINTS DE CATEGORÍAS (API)
  // ==========================================

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`).pipe(
      // Si categories devuelve wrapper, descomenta la siguiente línea:
      // map((res: any) => res.data) 
    );
  }

  // ==========================================
  // 3. ENDPOINTS DE PROGRESO Y MISIONES (API)
  // ==========================================

  getHabitProgress(habitId: number): Observable<HabitProgress> {
    return this.http.get<any>(
      `${this.apiUrl}/habits/${habitId}/progress`
    ).pipe(
      map(res => res.data), // Desempaquetamos
      tap(progress => this.currentHabitProgress$.next(progress))
    );
  }

  getCurrentProgress(): Observable<HabitProgress | null> {
    return this.currentHabitProgress$.asObservable();
  }

  updateMissionProgress(misionId: number, incremento: number = 1): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/missions/${misionId}/progress`,
      { incremento }
    ).pipe(
      map((res: any) => res.data), // Desempaquetamos antes de usarlo
      tap(data => this.currentHabitProgress$.next(data.progress))
    );
  }

  completeMission(misionId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/missions/${misionId}/complete`,
      {}
    ).pipe(
      map((res: any) => res.data), // Desempaquetamos
      tap(data => this.currentHabitProgress$.next(data.progress))
    );
  }

  getHabitAchievements(habitId: number): Observable<Achievement[]> {
    return this.http.get<any>(`${this.apiUrl}/habits/${habitId}/achievements`).pipe(
      map(res => res.data)
    );
  }

  // ==========================================
  // 4. MÉTODOS AUXILIARES (Lógica Frontend)
  // ==========================================

  getUserStats(habits: Habit[]): UserStats {
    if (!habits) return { totalHabits: 0, activeHabits: 0, completedMissions: 0, totalPoints: 0, longestStreak: 0 };
    
    return {
      totalHabits: habits.length,
      activeHabits: habits.filter(h => h.visibility).length,
      completedMissions: habits.reduce((sum, h) => sum + (h.total_missions || 0), 0),
      totalPoints: 0,
      longestStreak: 0
    };
  }

  getProgressPercentage(): number {
    return Math.floor(Math.random() * 100);
  }

  getCompletedMissionsCount(missions: Mission[]): number {
    if (!missions) return 0;
    return missions.filter(m => m.completed ?? false).length;
  }

  calculateLevelProgress(level: Level): number {
    const missions = level.missions || [];
    if (missions.length === 0) return 0;
    
    const completed = missions.filter(m => m.completed ?? false).length;
    return Math.round((completed / missions.length) * 100);
  }

  isLevelUnlocked(level: Level, previousLevel?: Level): boolean {
    if (level.levelNumber === 1) return true;
    if (!previousLevel) return false;
    
    const missions = previousLevel.missions || [];
    if (missions.length === 0) return false; 
    
    return missions.every(m => m.completed ?? false);
  }

  getMissionTypeLabel(type: Mission['type']): string {
    const labels: Record<string, string> = {
      'daily': 'Diaria',
      'weekly': 'Semanal',
      'unique': 'Única'
    };
    return labels[type || 'unique'] || 'Estándar';
  }
}