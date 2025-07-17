import axios from '../axios';

export const toggleWorkoutCompletion = async () => {
  const response = await axios.post('/progress/workout', { date: new Date().toISOString().split('T')[0] });
  return response.data;
};
