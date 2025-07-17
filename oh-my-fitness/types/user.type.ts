import { WeightHistoryItem, WorkoutHistoryItem } from "./progress.type";

export interface User {
  _id: string;
  firebaseUseId: string;
  profile: UserProfile;
  userInfo: UserInfo;
  progress: {
    weightHistory: WeightHistoryItem[];
    workouts: WorkoutHistoryItem[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  hasCompletedSurvey: boolean;
}

export interface UserProfile {
  personalGoalsExperience: PersonalGoalsExperience;
  scheduleAvailability: ScheduleAvailability;
  equipmentAccess: EquipmentAccess;
  dietaryPreferences: DietaryPreferences;
  healthConsiderations: HealthConsiderations;
  preferencesMotivation: PreferencesMotivation;
}

export interface PersonalGoalsExperience {
  primaryFitnessGoal: string;
  currentWeightLbs: number;
  desiredWeightLbs: number;
  heightCms: number;
  currentFitnessLevel: string;
  ageGroup: string;
}

export type ScheduleAvailability = Record<"daysPerWeekWorkout" | "preferredWorkoutTimes", string>;

export interface EquipmentAccess {
  equipment: string[];
  location: string;
}

export interface DietaryPreferences {
  primaryDietaryPreference: string;
  restrictionsAllergies: string[];
}

export interface HealthConsiderations {
  medicalConditions: string;
  workoutsToAvoid: string[];
}

export interface PreferencesMotivation {
  enjoyedWorkoutTypes: string[];
}