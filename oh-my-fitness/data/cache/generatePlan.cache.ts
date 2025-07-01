import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { SurveyData } from '@/contexts/SurveyContext';
import { User } from '@/types/user.type';

import { generatePersonalizedPlan } from '../api/generatePlan.api';

interface UserOnboarding {
  surveyData: Partial<SurveyData>;
  userInfo: User;
}

export const useGeneratePersonalizedPlan = () => {
  const options: UseMutationOptions<any, Error, UserOnboarding> = {
    mutationFn: async ({ surveyData, userInfo }: UserOnboarding) => {
            return await generatePersonalizedPlan(surveyData, userInfo);
    },
    onError: (error: Error) => {
      console.error('Error generating personalized plan:', error);
    },
  };

  return useMutation(options);
};