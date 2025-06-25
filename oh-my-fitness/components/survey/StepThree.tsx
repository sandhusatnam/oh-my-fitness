import React, { useState } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { Button, Input, SelectionButton, CheckboxItem } from '@/components/common';
import { useSurvey } from '@/contexts/SurveyContext';
import { theme } from '@/constants/theme';

const dietaryPreferenceOptions = [
  'No preference',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Paleo',
  'Low Carb',
  'Mediterranean'
];

const restrictionOptions = [
  'Gluten-free',
  'Dairy-free',
  'Nut-free',
  'Soy-free',
  'Shellfish-free',
  'Egg-free',
  'Sugar-free',
  'Other'
];

export const StepThree: React.FC = () => {
  const { state, updateData, nextStep, previousStep } = useSurvey();
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    state.data.dietaryPreferences || []
  );
  const [restrictions, setRestrictions] = useState<string[]>(
    state.data.dietaryRestrictions || []
  );
  const [otherRestrictions, setOtherRestrictions] = useState(
    state.data.otherRestrictions || ''
  );
  const [healthConsiderations, setHealthConsiderations] = useState(
    state.data.healthConsiderations || ''
  );

  const handlePreferenceSelect = (preference: string) => {
    const updatedPreferences = dietaryPreferences.includes(preference)
      ? dietaryPreferences.filter(p => p !== preference)
      : [...dietaryPreferences, preference];
    setDietaryPreferences(updatedPreferences);
  };

  const handleRestrictionSelect = (restriction: string) => {
    const updatedRestrictions = restrictions.includes(restriction)
      ? restrictions.filter(r => r !== restriction)
      : [...restrictions, restriction];
    setRestrictions(updatedRestrictions);
  };

  const handleNext = () => {
    updateData({
      dietaryPreferences,
      dietaryRestrictions: restrictions,
      otherRestrictions,
      healthConsiderations,
    });
    nextStep();
  };

  const handleSkip = () => {
    updateData({
      dietaryPreferences: ['No preference'],
      dietaryRestrictions: [],
      otherRestrictions: '',
      healthConsiderations: '',
    });
    nextStep();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={previousStep} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.headerCenter} />
            <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity> 
        </View>
          
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>3/4</Text>
      </View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
        <Text style={styles.title}>
          Tell us about your dietary preferences
        </Text>
        
        <View style={styles.preferencesContainer}>
          {dietaryPreferenceOptions.map((preference) => (
            <SelectionButton
              key={preference}
              title={preference}
              selected={dietaryPreferences.includes(preference)}
              onPress={() => handlePreferenceSelect(preference)}
              multiSelect={true}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Dietary Restrictions/Allergies</Text>
        
        <View style={styles.restrictionsContainer}>
          {restrictionOptions.map((restriction) => (
            <CheckboxItem
              key={restriction}
              title={restriction}
              checked={restrictions.includes(restriction)}
              onPress={() => handleRestrictionSelect(restriction)}
            />
          ))}
        </View>

        <Input
          placeholder="Specify any other restrictions"
          value={otherRestrictions}
          onChangeText={setOtherRestrictions}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        <Text style={styles.sectionTitle}>Health Considerations/Injuries</Text>
        
        <Input
          placeholder="Tell us about any health conditions or injuries we should consider when creating your plan"
          value={healthConsiderations}
          onChangeText={setHealthConsiderations}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
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
  backButton: {
    padding: 8,
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
  headerCenter: {
    flex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 32,
    lineHeight: 36,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
    gap: 2
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 20,
    marginTop: 8,
  },
  restrictionsContainer: {
    marginBottom: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 32,
  },
});