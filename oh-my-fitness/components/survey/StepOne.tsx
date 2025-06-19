import React, { useState, FC } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { SelectionButton } from '@/components/common/SelectionButton';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useSurvey } from '@/contexts/SurveyContext';
import { theme } from '@/constants/theme';

const fitnessGoalOptions = [
  'Lose weight',
  'Build muscle',
  'Gain Strength',
  'Maintain fitness',
  'Improve endurance',
  'Other'
];

const fitnessLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];
const ageGroupOptions = ['18-24', '25-34', '35-44', '45-54', '55+'];

export const StepOne: FC = () => {
  const { state, updateData, nextStep } = useSurvey();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    state.data.fitnessGoals || []
  );
  const [currentWeight, setCurrentWeight] = useState(state.data.currentWeight || '');
  const [desiredWeight, setDesiredWeight] = useState(state.data.desiredWeight || '');
  const [height, setHeight] = useState(state.data.height || '');
  const [fitnessLevel, setFitnessLevel] = useState(state.data.fitnessLevel || '');
  const [ageGroup, setAgeGroup] = useState(state.data.ageGroup || '');

  const handleGoalSelect = (goal: string) => {
    const updatedGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(updatedGoals);
  };

  const handleNext = () => {
    updateData({
      fitnessGoals: selectedGoals,
      currentWeight,
      desiredWeight,
      height,
      fitnessLevel,
      ageGroup,
    });
    nextStep();
  };

  const isValid = selectedGoals.length > 0 && !!currentWeight && !!height && !!fitnessLevel && !!ageGroup;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About you</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>1/10</Text>
      </View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
        <Text style={styles.title}>What are your fitness goals?</Text>
        
        <View style={styles.goalsContainer}>
          {fitnessGoalOptions.map((goal, index) => (
            <SelectionButton
              key={goal}
              title={goal}
              selected={selectedGoals.includes(goal)}
              onPress={() => handleGoalSelect(goal)}
              multiSelect={true}
            />
          ))}
        </View>

        <View style={styles.inputSection}>
          <Input
            placeholder="Current weight (lbs)"
            value={currentWeight}
            onChangeText={setCurrentWeight}
            keyboardType="numeric"
            style={styles.input}
          />

          <Input
            placeholder="Desired weight (lbs)"
            value={desiredWeight}
            onChangeText={setDesiredWeight}
            keyboardType="numeric"
            style={styles.input}
          />

          <Input
            placeholder="Height (in)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.sectionTitle}>Fitness Level</Text>
          <View style={styles.optionsRow}>
            {fitnessLevelOptions.map((level) => (
              <SelectionButton
                key={level}
                title={level}
                selected={fitnessLevel === level}
                onPress={() => setFitnessLevel(level)}
              />
            ))}
          </View>
        </View>

        <View style={styles.ageSection}>
          <Text style={styles.sectionTitle}>Age Group</Text>
          <View style={styles.ageGrid}>
            {ageGroupOptions.map((age) => (
              <SelectionButton
                key={age}
                title={age}
                selected={ageGroup === age}
                onPress={() => setAgeGroup(age)}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!isValid}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 32,
    lineHeight: 36,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    gap: 2
  },
  inputSection: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  levelSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2
  },
  ageSection: {
    marginBottom: 32,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    marginTop: 32,
  },
});