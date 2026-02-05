
export interface Category {
  id: number;          
  name: string;
  icon: string;
  color: string;
  order?: number;
  

  idCategory?: number; 
}

export interface Habit {
  idHabit: number;          
  name: string;         
  description: string;
  color: string;
  visibility: boolean;


  category_id?: number;
  category_name?: string;
  category_icon?: string;


  category?: Category;


  total_levels?: number;
  total_missions?: number;
  created_at?: string;
  updated_at?: string;

  title?: string; 
}

export interface Level {
  idLevel: number;          
  levelNumber: number;  
  name: string;
  description?: string;
  order?: number;
  missions: Mission[];
  completed?: boolean;
}

export interface Mission {
  idMission: number;            // Laravel mapea idMission -> 'id'
  name: string;
  description: string;
  icon?: string;
  points: number;        // Laravel envía 'points'
  type: 'daily' | 'weekly' | 'unique' | string;
  
  requirement: number;      // Laravel envía 'requirement'
  current_progress: number; // Laravel envía 'current_progress' (snake_case)
  completed: boolean;       // Laravel envía 'completed'
  
  completed_at?: string;    // Laravel envía 'completed_at' o similar
  tips?: string;
  links?: string;
  order?: number;
  
  // Alias por si algún componente antiguo busca 'title'
  title?: string;
}

export interface Achievement {
  id: number;            // Laravel envía 'id'
  name: string;
  description: string;
  icon: string;
}

// ==========================================
// 2. Interfaces Compuestas / Respuestas API
// ==========================================

export interface HabitDetail extends Habit {
  // Laravel envía 'current_level' (snake_case) en getHabitDetail
  current_level: number; 
  levels: Level[];
  
  // Datos de suscripción si vienen
  subscription?: {
    started_at: string;
    days_active: number;
  };
}

export interface HabitProgress {
  total_missions: number;
  completed_missions: number;
  overall_percentage: number;
  current_streak?: number;
  by_level?: LevelProgress[];
}

export interface LevelProgress {
  level_id: number;
  level_number: number;
  total_missions: number;
  completed_missions: number;
  percentage: number;
  is_completed: boolean;
}

export interface UserAchievement extends Achievement {
  date: string;
}

// ==========================================
// 3. Respuestas de Acciones (Post/Put)
// ==========================================

export interface CompleteMissionResponse {
  success: boolean;
  data: {
    mission: Mission;
    progress: HabitProgress;
    level_up: boolean;
    unlocked_achievements: Achievement[];
  };
}

export interface UpdateMissionProgressResponse {
  success: boolean;
  data: {
    mission: Mission;
    progress: HabitProgress;
    level_up: boolean;
  };
}

export interface UserStats {
  totalHabits: number;
  activeHabits: number;
  completedMissions: number;
  totalPoints?: number;
  longestStreak?: number;
  totalAchievements?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}