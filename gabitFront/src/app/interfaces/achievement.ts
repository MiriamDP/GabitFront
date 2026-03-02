export interface Achievement {
    idAchievement:     number;
    name:      string;
    description: string;
    icon:       string;
    idLevel:     number|null;
    level: Level|null;
    created_at:  null|string;
    updated_at:  null|string;
    pivot: AchievementPivot;
}

export interface Level {
  idLevel: number;
  name: string;
  description: string;
  levelNumber: number;
  order: number;
  habit: Habit | null;
  created_at: string;
  updated_at?: string;
}


export interface Habit {
  idHabit: number;
  name: string;
  description: string;
  color: string;
  visibility: boolean;
  category_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface AchievementPivot {
  idAchievement: number;
  idUser: number;
  date: string; 
  created_at: string;
  updated_at: string;
}