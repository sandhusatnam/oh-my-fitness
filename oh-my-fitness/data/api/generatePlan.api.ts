import { SurveyData } from '@/contexts/SurveyContext';
import { UserInfo } from '@/types/user.type';

import api from '../axios';

const transformSurveyData = (data: any) => {
  return {
    personalGoalsExperience: {
      primaryFitnessGoal: data.fitnessGoals[0],
      currentWeightLbs: parseInt(data.currentWeight, 10),
      desiredWeightLbs: parseInt(data.desiredWeight, 10),
      heightCms: Math.round(parseInt(data.height, 10) * 2.54),
      currentFitnessLevel: data.fitnessLevel,
      ageGroup: data.ageGroup
    },
    scheduleAvailability: {
      daysPerWeekWorkout: data.workoutDaysPerWeek === 4 ? "3-4" : `${data.workoutDaysPerWeek}`,
      preferredWorkoutTimes: data.preferredWorkoutTime
    },
    equipmentAccess: {
      equipment: data.availableEquipment,
      location: "Home"
    },
    dietaryPreferences: {
      primaryDietaryPreference: data.dietaryPreferences[0] || "No preference",
      restrictionsAllergies: data.dietaryRestrictions
    },
    healthConsiderations: {
      medicalConditions: data.healthConsiderations || "None",
      workoutsToAvoid: data.workoutsToAvoid
    },
    preferencesMotivation: {
      enjoyedWorkoutTypes: data.enjoyedWorkouts
    }
  };
};

export const generatePersonalizedPlan = async (surveyData: Partial<SurveyData>, userInfo: UserInfo) => {
  try {
    const transformedData = transformSurveyData(surveyData);

    const response = await api.post('/users/onboarding', {
      profile: transformedData,
      userInfo
    });

    return response.data;
  } catch (error) {
    console.error('Plan generation error:', error);
    throw error;
  }
};