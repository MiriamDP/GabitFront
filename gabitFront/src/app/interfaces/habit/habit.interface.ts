
export interface Category {
  id: number;          
  name: string;
  icon: string;
  color: string;
  order?: number;
  idCategory: number; 
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

  author: { username: string } | null;
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
  idMission: number;          
  name: string;
  description: string;
  icon?: string;
  points: number;        
  type: 'daily' | 'weekly' | 'unique' | string;
  
  requirement: number;    
  current_progress: number; 
  completed: boolean;       
  
  completed_at?: string;
  tips?: string;
  links?: string;
  order?: number;
  title?: string;
}

export interface Achievement {
  id: number;           
  name: string;
  description: string;
  icon: string;
}

export interface HabitDetail extends Habit {
  current_level: number; 
  levels: Level[];

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
  total_points?: number;
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