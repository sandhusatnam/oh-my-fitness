import React, { useEffect } from 'react';

import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

export default function LoadingScreen() {
  const { updateUser } = useAuth();
  const { state: surveyState } = useSurvey();
  const progress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Start progress animation
    progress.value = withTiming(100, { 
      duration: 3000,
      easing: Easing.out(Easing.quad)
    });

    // Pulse animation
    pulseScale.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );

    // Simulate API call and plan generation
    const timer = setTimeout(() => {
      // Mark user as having completed survey
      updateUser({ hasCompletedSurvey: true });
      
      // Navigate to main app
      router.replace('/(tabs)');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oh My Fitness!</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Analyzing your responses</Text>
        
        <Text style={styles.subtitle}>
          We are crafting your personalized fitness and nutrition plan based on your goals and preferences. This may take a moment.
        </Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Generating your plan...</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
});