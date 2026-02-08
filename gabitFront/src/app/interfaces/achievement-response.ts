import { Achievement } from "./achievement";

export interface AchievementResponse {
    success: boolean,
    message: string,
    logros: Achievement[],
}
