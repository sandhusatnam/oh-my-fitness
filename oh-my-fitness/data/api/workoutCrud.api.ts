import { formatDateYMD } from '@/utils/date.util';

import axios from '../axios';

export const logWorkoutCompletion = async () => {
  const response = await axios.post('/progress/workout', { date: formatDateYMD(new Date()) });
  return response.data;
};

export const deleteWorkout = async (workoutId: string) => {
  console.log('Deleting workout with ID:', workoutId);
  const response = await axios.delete(`/progress/workout/${workoutId}`);
  return response.data;
};