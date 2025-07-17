import { useQuery } from '@tanstack/react-query';
import { getWeightHistory, GetWeightHistoryResponse } from '../api/getWeightHistory.api';

export const useGetWeightHistory = (startDate: string, endDate: string) => {
  return useQuery<GetWeightHistoryResponse>({
    queryKey: ['weightHistory', startDate, endDate],
    queryFn: () => getWeightHistory(startDate, endDate),
  });
};
