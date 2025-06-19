import React, { FC, useState } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Button, SelectionButton } from '@/components/common';
import { useSurvey } from '@/contexts/SurveyContext';
import { theme } from '@/constants/theme';

const workoutDayOptions = [1, 2, 3, 4, 5, 6, 7];
const workoutTimeOptions = ['Morning', 'Midday', 'Evening'];
const equipmentOptions = ['None', 'Dumbbells', 'Barbell', 'Gym Access', 'Resistance Bands', 'Kettlebells'];

export const StepTwo: FC = () => {
  const { state, updateData, nextStep, previousStep } = useSurvey();
  const [workoutDays, setWorkoutDays] = useState<number>(
    state.data.workoutDaysPerWeek || 4
  );
  const [workoutTime, setWorkoutTime] = useState(
    state.data.preferredWorkoutTime || ''
  );
  const [equipment, setEquipment] = useState<string[]>(
    state.data.availableEquipment || []
  );

  const handleEquipmentSelect = (item: string) => {
    const updatedEquipment = equipment.includes(item)
      ? equipment.filter(e => e !== item)
      : [...equipment, item];
    setEquipment(updatedEquipment);
  };

  const handleNext = () => {
    updateData({
      workoutDaysPerWeek: workoutDays,
      preferredWorkoutTime: workoutTime,
      availableEquipment: equipment,
    });
    nextStep();
  };

  const isValid = !!workoutTime && equipment.length > 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={previousStep} style={styles.backButton}>
          <Feather name="x" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Schedule</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>2/4</Text>
      </View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
        <Text style={styles.title}>
          How many days per week can you workout?
        </Text>
        
        <View style={styles.daysGrid}>
          {workoutDayOptions.map((day) => (
            <SelectionButton
              key={day}
              title={day.toString()}
              selected={workoutDays === day}
              onPress={() => setWorkoutDays(day)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          What time of day do you prefer to workout?
        </Text>
        
        <View style={styles.timeOptions}>
          {workoutTimeOptions.map((time) => (
            <SelectionButton
              key={time}
              title={time}
              selected={workoutTime === time}
              onPress={() => setWorkoutTime(time)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          What equipment do you have access to?
        </Text>
        
        <View style={styles.equipmentOptions}>
          {equipmentOptions.map((item) => (
            <SelectionButton
              key={item}
              title={item}
              selected={equipment.includes(item)}
              onPress={() => handleEquipmentSelect(item)}
              multiSelect={true}
            />
          ))}
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
    borderBottomColor: theme.colors.backgroundTertiary,
  },
  backButton: {
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
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 48,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 24,
    lineHeight: 36,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 48,
    justifyContent: 'space-between',
  },
  equipmentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 48,
    gap: 2
  },
  buttonContainer: {
    marginTop: 32,
  },
});