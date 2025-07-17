import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWeight, UpdateWeightPayload } from '../api/updateWeight.api';

export const useUpdateWeight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWeightPayload) => updateWeight(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWithPlan'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['weightHistory'] });
    },
  });
};
