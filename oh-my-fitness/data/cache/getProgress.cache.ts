import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getProgress } from '../api/getProgress.api';
import type { ProgressData } from '@/types/progress.type';

export const useGetProgress = (startDate: string, endDate: string) => {
  return useQuery<ProgressData>({
    queryKey: ['progress', startDate, endDate],
    queryFn: () => getProgress(startDate, endDate),
  });
};

export const useInvalidateProgress = () => {
  const queryClient = useQueryClient();
  return (startDate: string, endDate: string) =>
    queryClient.invalidateQueries({ queryKey: ['progress', startDate, endDate] });
};
