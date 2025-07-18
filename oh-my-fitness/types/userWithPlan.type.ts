import { User } from "./user.type";

export interface UserWithPlan {
  user: User;
  fitnessPlan: FitnessPlan;
}

export interface FitnessPlan {
  userId: string;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface Plan {
  general_notes: string;
  weekly_plan: WeeklyPlan;
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type WeeklyPlan = Record<DayOfWeek, DailyPlan>;

export interface DailyPlan {
  diet: DietPlan;
  workout: WorkoutPlan;
}

export interface DietPlan {
  meals_list: Meal[];
  daily_notes: string;
}

export interface Meal {
  description: string;
  meal_type: string;
  imageUrl: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WorkoutPlan {
  duration_minutes: number;
  exercises: Exercise[];
  type: string;
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  imageUrl: string;
}
