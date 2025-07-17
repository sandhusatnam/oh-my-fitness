import axios from '../axios';
import type { ProgressData } from '@/types/progress.type';

export const getProgress = async (startDate: string, endDate: string): Promise<ProgressData> => {
  const response = await axios.get(
    `/progress?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
