import { useState, useEffect } from 'react';

import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MealModal, WorkoutModal } from '@/components/plan';
import { daysOfWeek } from '@/constants/app';
import { theme } from '@/constants/theme';
import { useGetUserWithPlan } from '@/data/cache/getUserProfile.cache';
import { toggleWorkoutCompletion } from '@/data/api/markWorkoutDone.api';
import { useGetProgress, useInvalidateProgress } from '@/data/cache/getProgress.cache';
import type { ProgressData, WorkoutHistoryItem } from '@/types/progress.type';
import { DayOfWeek, Exercise, Meal } from '@/types/userWithPlan.type';

export default function TodayScreen() {
  const { data: userWithPlan, isLoading, error } = useGetUserWithPlan();
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Exercise[] | null>(null);
  const [markingDone, setMarkingDone] = useState(false);
  const [doneSuccess, setDoneSuccess] = useState(false);

  const today = daysOfWeek[new Date(Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' }).format(new Date())).getDay()];
  const todayPlan = userWithPlan?.fitnessPlan?.plan?.weekly_plan?.[today as DayOfWeek];

  const openMealModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealModalVisible(true);
  };

  const openWorkoutModal = (workout: Exercise[]) => {
    setSelectedWorkout(workout);
    setWorkoutModalVisible(true);
  };

  const todayDate = new Date();
  const todayDateStr = todayDate.toISOString().split('T')[0];
  const endDateObj = new Date(todayDate);
  endDateObj.setDate(todayDate.getDate() + 1);
  const endDate = endDateObj.toISOString().split('T')[0];
  const startDateObj = new Date(todayDate);
  startDateObj.setDate(todayDate.getDate() - 30);
  const startDate = startDateObj.toISOString().split('T')[0];
  const { data: progress } = useGetProgress(startDate, endDate);
  const invalidateProgress = useInvalidateProgress();

  useEffect(() => {
    const workoutDone = progress?.workoutData?.history?.some((item: WorkoutHistoryItem) => item.date.startsWith(todayDateStr));
    setDoneSuccess(!!workoutDone);
  }, [progress, todayDateStr]);

  const handleMarkWorkoutDone = async () => {
    setMarkingDone(true);
    try {
      await toggleWorkoutCompletion();
      await invalidateProgress(startDate, endDate);
    } catch (e) {
      // swallow error
    } finally {
      setMarkingDone(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          </View>
        ) : todayPlan ? (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Workout</Text>
            {!!todayPlan.workout && (
              <View style={styles.workoutCard}>
                {todayPlan.workout.exercises[0]?.imageUrl ? (
                  <Image
                    source={{ uri: todayPlan.workout.exercises[0].imageUrl }}
                    style={styles.workoutImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.workoutImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.backgroundTertiary }]}> 
                    <Ionicons name="image-outline" size={48} color={theme.colors.textSecondary} />
                    <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>Image coming soon</Text>
                  </View>
                )}
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutTitle}>{todayPlan.workout.type}</Text>
                  <Text style={styles.workoutDescription}>{todayPlan.workout.notes}</Text>
                  <Text style={styles.workoutMeta}>{`${todayPlan.workout.duration_minutes} min`}</Text>
                  <TouchableOpacity style={styles.viewButton} onPress={() => openWorkoutModal(todayPlan.workout.exercises)}>
                    <Text style={styles.viewButtonText}>View Exercises</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.viewButton, { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: doneSuccess ? theme.colors.success : theme.colors.backgroundTertiary }]}
                    onPress={handleMarkWorkoutDone}
                    disabled={markingDone}
                  >
                    {markingDone ? (
                      <ActivityIndicator size="small" color={theme.colors.textPrimary} style={{ marginRight: 8 }} />
                    ) : (
                      <Ionicons name={doneSuccess ? 'checkmark-done' : 'checkmark-done-outline'} size={18} color={theme.colors.textPrimary} style={{ marginRight: 8 }} />
                    )}
                    <Text style={styles.viewButtonText}>{doneSuccess ? 'Workout Done!' : 'Mark as Done'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Nutrition</Text>
            {!!todayPlan.diet && (
              <View style={styles.mealSection}>
                {todayPlan.diet.meals_list.map((meal: Meal, index: number) => (
                  <View key={index} style={styles.mealItem}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealTitle}>{meal.meal_type}</Text>
                      <Text style={styles.mealDescription}>{meal.description}</Text>
                      <TouchableOpacity style={styles.viewButton} onPress={() => openMealModal(meal)}>
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                    {meal.imageUrl ? (
                      <Image
                        source={{ uri: meal.imageUrl }}
                        style={styles.mealImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.mealImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.backgroundTertiary }]}> 
                        <Ionicons name="image-outline" size={32} color={theme.colors.textSecondary} />
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 10, marginTop: 4 }}>Image coming soon</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.errorWrapper}>
            <Text style={styles.errorText}>Failed to load daily plan.</Text>
          </View>
        )}
      </ScrollView>

      <MealModal
        visible={mealModalVisible}
        meal={selectedMeal}
        onClose={() => setMealModalVisible(false)}
      />

      <WorkoutModal
        visible={workoutModalVisible}
        exercises={selectedWorkout}
        onClose={() => setWorkoutModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  workoutCard: {
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xxxl,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workoutImage: {
    width: '100%',
    height: 200,
  },
  workoutInfo: {
    padding: theme.spacing.lg,
  },
  workoutTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  workoutDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  workoutMeta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    paddingBottom: 10
  },
  mealSection: {
    gap: theme.spacing.lg,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  mealInfo: {
    flex: 1,
    marginRight: theme.spacing.lg,
  },
  mealTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  mealDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  viewButton: {
    backgroundColor: theme.colors.backgroundTertiary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.lg,
  },
});