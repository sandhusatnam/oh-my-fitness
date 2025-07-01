import { UserWithPlan } from '@/types/userWithPlan.type';

import api from '../axios';

export const getUserProfileWithPlan = async () => {
  try {
    const response = await api.get<UserWithPlan>('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Get user profile:', error);
    throw error;
  }
};