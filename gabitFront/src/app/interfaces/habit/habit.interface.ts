export interface Habit {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  categoria_nombre?: string;
  categoria_icono?: string;
  color: string;
  es_publico: boolean;
  total_niveles: number;
  total_niveles_creados?: number;
  total_misiones?: number;
  fecha_creacion: string;
  fecha_modificacion?: string;
  activo: boolean;
  veces_copiado?: number;
}

export interface HabitProgress {
  id: number;
  habit: Habit;
  nivel_actual: number;
  puntos_totales: number;
  racha_dias: number;
  mejor_racha: number;
  fecha_inicio: string;
  fecha_ultima_actividad: string;
  progreso_porcentaje: number;
}

export interface Category {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
  color: string;
  orden: number;
  activa: boolean;
}

export interface UserStats {
  totalHabits: number;
  activeHabits: number;
  completedMissions: number;
  totalPoints: number;
  longestStreak: number;
}
