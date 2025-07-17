import { UpdateWeightResponse } from '@/types/updateWeightResponse.type';
import axios from '../axios';

export interface UpdateWeightPayload {
  date: string;
  weight: number;
}

export const updateWeight = async (payload: UpdateWeightPayload) => {
  const response = await axios.post<UpdateWeightResponse>('/progress/weight', payload);
  return response.data;
};
