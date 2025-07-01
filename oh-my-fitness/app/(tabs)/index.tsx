import { useState } from 'react';

import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MealModal, WorkoutModal } from '@/components/plan';
import { theme } from '@/constants/theme';
import { useGetUserWithPlan } from '@/data/cache/getUserProfile.cache';
import { DayOfWeek, Exercise, Meal } from '@/types/userWithPlan.type';

export default function TodayScreen() {
  const { data: userWithPlan, isLoading, error } = useGetUserWithPlan();
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Exercise[] | null>(null);

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  const todayPlan = userWithPlan?.fitnessPlan?.plan?.weekly_plan?.[daysOfWeek[today] as DayOfWeek];

  const openMealModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealModalVisible(true);
  };

  const openWorkoutModal = (workout: Exercise[]) => {
    setSelectedWorkout(workout);
    setWorkoutModalVisible(true);
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
                <Image
                  source={{ uri: todayPlan.workout.exercises[0]?.imageUrl }}
                  style={styles.workoutImage}
                  resizeMode="cover"
                />
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutTitle}>{todayPlan.workout.type}</Text>
                  <Text style={styles.workoutDescription}>{todayPlan.workout.notes}</Text>
                  <Text style={styles.workoutMeta}>{`${todayPlan.workout.duration_minutes} min`}</Text>
                  <TouchableOpacity style={styles.viewButton} onPress={() => openWorkoutModal(todayPlan.workout.exercises)}>
                    <Text style={styles.viewButtonText}>View Exercises</Text>
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
                    <Image
                      source={{ uri: meal.imageUrl }}
                      style={styles.mealImage}
                      resizeMode="cover"
                    />
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