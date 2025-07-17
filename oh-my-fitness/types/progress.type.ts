export interface WeightHistoryItem {
  _id: string;
  date: string;
  weight: number;
}

export interface WorkoutHistoryItem {
  _id: string;
  date: string;
  workoutId: string;
  notes: string;
}

export interface ProgressData {
  weightData: {
    history: WeightHistoryItem[];
    metrics: Record<string, unknown>;
  };
  workoutData: {
    history: WorkoutHistoryItem[];
    metrics: MetricsData;
    };
}

export interface MetricsData {
    frequency: {
        totalWorkouts: number;
        workoutsThisWeek: number;
        daysTracked: number;
        longestStreak: number;
    };
    mostRecent: {
        date: Date;
    }
}