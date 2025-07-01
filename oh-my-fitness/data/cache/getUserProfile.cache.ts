import { useQuery } from '@tanstack/react-query';

import { UserWithPlan } from '@/types/userWithPlan.type';

import { getUserProfileWithPlan } from '../api/getUserProfile';

export const useGetUserWithPlan = () => {
  return useQuery<UserWithPlan, Error>({
    queryKey: ['userWithPlan'],
    queryFn: getUserProfileWithPlan
  });
};