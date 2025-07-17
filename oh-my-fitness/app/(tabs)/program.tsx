import { useState } from 'react';

import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MealModal, WorkoutModal } from '@/components/plan';
import { daysOfWeek } from '@/constants/app';
import { theme } from '@/constants/theme';
import { useGetUserWithPlan } from '@/data/cache/getUserProfile.cache';
import { DayOfWeek, Exercise, Meal } from '@/types/userWithPlan.type';

export default function ProgramScreen() {
  const { data: userWithPlan, isLoading, error } = useGetUserWithPlan();
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Exercise[] | null>(null);
  const today = daysOfWeek[new Date(Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' }).format(new Date())).getDay()];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today as DayOfWeek);

  const openMealModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealModalVisible(true);
  };

  const openWorkoutModal = (workout: Exercise[]) => {
    setSelectedWorkout(workout);
    setWorkoutModalVisible(true);
  };

  const dayPlan = userWithPlan?.fitnessPlan?.plan?.weekly_plan?.[selectedDay];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Plan</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
          contentContainerStyle={styles.daySelectorContent}
        >
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayItem,
                selectedDay === day && styles.selectedDayItem
              ]}
              onPress={() => setSelectedDay(day as DayOfWeek)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText
              ]}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          </View>
        ) : dayPlan ? (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Workout</Text>
            {!!dayPlan.workout && (
              <View style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityLabel}>Workout</Text>
                  <Text style={styles.activityTitle}>{dayPlan.workout.type}</Text>
                  {dayPlan.workout.type && dayPlan.workout.type.toLowerCase() === 'rest' ? (
                    <Text style={{ color: theme.colors.textSecondary, marginTop: 10, fontStyle: 'italic' }}>Rest Day – No workout scheduled</Text>
                  ) : (
                    <>
                      <Text style={styles.activityDuration}>{`${dayPlan.workout.duration_minutes} min`}</Text>
                      <TouchableOpacity style={styles.viewButton} onPress={() => openWorkoutModal(dayPlan.workout.exercises)}>
                        <Text style={styles.viewButtonText}>View Exercises</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                {dayPlan.workout.type && dayPlan.workout.type.toLowerCase() !== 'rest' && (
                  <Image
                    source={{ uri: dayPlan.workout.exercises[0]?.imageUrl }}
                    style={styles.activityImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>Nutrition</Text>
            {!!dayPlan.diet && (
              <View style={styles.mealSection}>
                {dayPlan.diet.meals_list.map((meal: Meal, index: number) => (
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
  daySelector: {
    paddingVertical: theme.spacing.lg,
  },
  daySelectorContent: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  dayItem: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedDayItem: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  selectedDayText: {
    color: theme.colors.textInverse,
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
  activityItem: {
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
  activityInfo: {
    flex: 1,
    marginRight: theme.spacing.lg,
  },
  activityLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  activityTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  activityDuration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    paddingBottom: 10,
  },
  activityImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
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