// import { Habit } from "src/app/interfaces/achievement";

// export interface HabitLibrary extends Habit{
//     leave_date: Date|null|string;
// }
export interface HabitLibrary{
    idHabit: number;          
      name: string;         
      description: string;
      color: string;
      visibility: boolean;
    
      category_name?: string;
    
      total_levels?: number;
      total_missions?: number;
      created_at?: string;
    
    leave_date: Date|null|string;
}
