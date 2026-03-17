export interface Achievement {
    idAchievement:  number;
    name:           string;
    description:    string;
    icon:           string;
    idHabit:        number | null;
    idLevel:        number | null;
    idMission:      number | null;
    habit:          Habit | null;
    level:          Level | null;
    mission:        Mission | null;
    created_at:     null | string;
    updated_at:     null | string;
    pivot:          AchievementPivot;
}

export interface Level {
    idLevel:      number;
    name:         string;
    description:  string;
    levelNumber:  number;
    order:        number;
    habit:        Habit | null;
    created_at:   string;
    updated_at?:  string;
}

export interface Habit {
    idHabit:      number;
    name:         string;
    description:  string;
    color:        string;
    visibility:   boolean;
    category_id?: number;
    created_at:   string;
    updated_at?:  string;
}

export interface Mission {
    idMission:    number;
    name:         string;
    description:  string;
    points:       number;
    level:        Level | null;
    created_at:   string;
    updated_at?:  string;
}

export interface AchievementPivot {
    idAchievement: number;
    idUser:        number;
    date:          string;
    created_at:    string;
    updated_at:    string;
}