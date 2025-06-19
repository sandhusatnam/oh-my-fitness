import React from 'react';

import { View, StyleSheet, SafeAreaView } from 'react-native';

import { useSurvey } from '@/contexts/SurveyContext';
import { ProgressBar } from '@/components/common';
import { StepOne, StepTwo, StepThree } from '@/components/survey';

export default function SurveyScreen() {
  const { state } = useSurvey();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <>4</>;
      default:
        return <>1</>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar 
        currentStep={state.currentStep} 
        totalSteps={state.totalSteps} 
      />
      <View style={styles.content}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});