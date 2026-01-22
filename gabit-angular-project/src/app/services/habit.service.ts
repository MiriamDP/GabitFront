import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit, HabitProgress, Category, UserStats } from '../interfaces/habit/habit.interface';

// Interfaces adicionales para creación de hábitos
export interface HabitCreation {
  name: string;
  description: string;
  category: number;
  color: string;
  isPublic: boolean;
  levels: Level[];
  achievements: Achievement[];
}

export interface Level {
  name: string;
  pointsRequired: number;
  missions: Mission[];
}

export interface Mission {
  description: string;
  points: number;
  type: 'diaria' | 'semanal' | 'unica';
  requirement: number;
}

export interface Achievement {
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
  requirement: string;
}

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = 'http://localhost:3000/gabit';

  constructor(private http: HttpClient) { }

  // ============================
  // CREAR Y OBTENER HÁBITOS
  // ============================

  /**
   * Crear un nuevo hábito
   */
  createHabit(habit: HabitCreation | any): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits/crear`, habit);
  }

  /**
   * Obtener hábitos del usuario
   */
  getUserHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits/leer`);
  }

  /**
   * Obtener un hábito específico
   */
  getHabitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits/leer/${id}`);
  }

  /**
   * Obtener hábitos públicos
   */
  getPublicHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/leer`);
  }

  // ============================
  // ACTUALIZAR Y ELIMINAR
  // ============================

  /**
   * Actualizar un hábito
   */
  updateHabit(id: number, habit: Partial<Habit>): Observable<any> {
    return this.http.put(`${this.apiUrl}/habits/actualizar/${id}`, habit);
  }

  /**
   * Eliminar un hábito
   */
  deleteHabit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/habits/borrar/${id}`);
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
  // ESTADÍSTICAS Y PROGRESO
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
   * Generar progreso mock para demostración
   */
  getProgressPercentage(): number {
    return Math.floor(Math.random() * 100);
  }
}