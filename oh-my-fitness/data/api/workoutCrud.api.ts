import axios from '../axios';

export const logWorkoutCompletion = async () => {
  const response = await axios.post('/progress/workout', { date: new Date().toISOString().split('T')[0] });
  return response.data;
};

export const deleteWorkout = async (workoutId: string) => {
  console.log('Deleting workout with ID:', workoutId);
  const response = await axios.delete(`/progress/workout/${workoutId}`);
  return response.data;
};