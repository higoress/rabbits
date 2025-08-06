import { Models } from "react-native-appwrite";


export interface Habit extends Models.Document {
    user_id: string;
    title: string;
    description: string;
    frequency: string;
    streak_count: number;
    created_at: string;
    last_completed: string;
}

export interface CompletedHabit extends Models.Document {
    habit_id: string;
    user_id: string;
    completed_at: string;
}