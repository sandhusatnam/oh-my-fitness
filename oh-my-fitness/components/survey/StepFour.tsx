import React, { useState } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { CheckboxItem, Button } from '@/components/common';
import { useSurvey } from '@/contexts/SurveyContext';
import { theme } from '@/constants/theme';

const workoutTypeOptions = [
  'Strength Training',
  'HIIT',
  'Yoga',
  'Cardio',
  'Pilates',
  'Dance'
];

const workoutsToAvoidOptions = [
  'High-Impact',
  'Heavy Lifting',
  'Long Cardio'
];

export default function StepFour() {
  const { state, updateData, reset } = useSurvey();
  const [enjoyedWorkouts, setEnjoyedWorkouts] = useState<string[]>(
    state.data.enjoyedWorkouts || []
  );
  const [workoutsToAvoid, setWorkoutsToAvoid] = useState<string[]>(
    state.data.workoutsToAvoid || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { previousStep } = useSurvey();

  const handleEnjoyedWorkoutSelect = (workout: string) => {
    const updated = enjoyedWorkouts.includes(workout)
      ? enjoyedWorkouts.filter(w => w !== workout)
      : [...enjoyedWorkouts, workout];
    setEnjoyedWorkouts(updated);
  };

  const handleAvoidWorkoutSelect = (workout: string) => {
    const updated = workoutsToAvoid.includes(workout)
      ? workoutsToAvoid.filter(w => w !== workout)
      : [...workoutsToAvoid, workout];
    setWorkoutsToAvoid(updated);
  };

  const handleSubmit = async () => {
    if (enjoyedWorkouts.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one workout type you enjoy.');
      return;
    }

    setIsSubmitting(true);
    
    // Update final data
    updateData({
      enjoyedWorkouts,
      workoutsToAvoid,
    });

    // Navigate to ??
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={previousStep} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.headerCenter} />

      </View>

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>4/4</Text>
      </View>
          

      <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
        <Text style={styles.title}>What types of workouts do you enjoy?</Text>
        <Text style={styles.subtitle}>
          Select all that apply. This helps us tailor your fitness plan.
        </Text>
        
        <View style={styles.workoutContainer}>
          {workoutTypeOptions.map((workout) => (
            <CheckboxItem
              key={workout}
              title={workout}
              checked={enjoyedWorkouts.includes(workout)}
              onPress={() => handleEnjoyedWorkoutSelect(workout)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          Are there any workouts you'd like to avoid?
        </Text>
        <Text style={styles.subtitle}>
          Select all that apply. We'll make sure to exclude these from your plan.
        </Text>
        
        <View style={styles.avoidContainer}>
          {workoutsToAvoidOptions.map((workout) => (
            <CheckboxItem
              key={workout}
              title={workout}
              checked={workoutsToAvoid.includes(workout)}
              onPress={() => handleAvoidWorkoutSelect(workout)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isSubmitting ? "Generating Your Plan..." : "Generate My Plan"}
            onPress={handleSubmit}
            disabled={isSubmitting || enjoyedWorkouts.length === 0}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerCenter: {
    flex: 1,
   },
   stepIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    paddingBottom: 100,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxxl,
    lineHeight: 24,
  },
  workoutContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    lineHeight: 36,
  },
  avoidContainer: {
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: theme.spacing.xxxl,
  },
});

export { StepFour }