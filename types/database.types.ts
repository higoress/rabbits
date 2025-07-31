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