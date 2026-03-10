import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators'; // Importamos map
import { environment } from 'src/environments/environment';
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
  private baseUrl: string = environment.apiUrl;

  // Para mantener el progreso actualizado en tiempo real en el detalle del hábito
  private currentHabitProgress$ = new BehaviorSubject<HabitProgress | null>(null);

  constructor(private http: HttpClient) { }

  getUserHabits(): Observable<any> {
    return this.http.get(`${this.baseUrl}/habits`);
  }

  createHabit(habit: Habit | any): Observable<any> {
    return this.http.post(`${this.baseUrl}/habits`, habit);
  }


  getHabitDetail(habitId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/habits/${habitId}/detail`);
  }

  getHabitById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/habits/${id}`);
  }

  updateHabit(id: number, habit: Partial<Habit>): Observable<any> {
    return this.http.put(`${this.baseUrl}/habits/${id}`, habit);
  }

  getPublicHabits(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/habits`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getHabitProgress(habitId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/habits/${habitId}/progress`);
  }


  getCurrentProgress(): Observable<HabitProgress | null> {
    return this.currentHabitProgress$.asObservable();
  }

  updateMissionProgress(misionId: number, incremento: number = 1): Observable<any> {
    return this.http.post(`${this.baseUrl}/missions/${misionId}/progress`, { incremento });
  }

  completeMission(misionId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/missions/${misionId}/complete`, {});
  }

  getHabitAchievements(habitId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/habits/${habitId}/achievements`);
  }


  getUserStats(habits: Habit[]): UserStats {
    if (!habits) return { 
      totalHabits: 0, 
      activeHabits: 0, 
      completedMissions: 0, 
      totalPoints: 0, 
      longestStreak: 0 
    };
    
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