export interface Category {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
  color: string;
  orden: number;
  activa: boolean;
}

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
  total_misiones?: number;
  fecha_creacion: string;
  fecha_modificacion?: string;
  activo: boolean;
  veces_copiado?: number;
}

export interface HabitDetail extends Habit {
  nivel_actual: number;
  puntos_totales: number;
  racha_dias: number;
  mejor_racha?: number;
  niveles: Level[];
  logros?: Achievement[];
}



export interface HabitProgress {
  id: number;
  habito_id: number;  
  nivel_actual: number;
  puntos_totales: number;
  racha_dias: number;
  mejor_racha: number;
  fecha_inicio: string;
  fecha_ultima_actividad: string;
  progreso_porcentaje: number;
}


export interface Level {
  id: number;
  numero_nivel: number;
  nombre: string;
  puntos_requeridos: number;
  puntos_actuales: number;
  completado: boolean;
  misiones: Mission[];
}

export interface Mission {
  id: number;
  descripcion: string;
  puntos: number;
  tipo: 'diaria' | 'semanal' | 'unica';
  requisito: number;
  progreso_actual: number;
  completada: boolean;
  fecha_completada?: string;
}


export interface Achievement {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  puntos_recompensa: number;
  requisito: string;
  desbloqueado: boolean;
  fecha_desbloqueo?: string;
}


export interface UserStats {
  totalHabits: number;
  activeHabits: number;
  completedMissions: number;
  totalPoints: number;
  longestStreak: number;
  totalAchievements?: number;
}

