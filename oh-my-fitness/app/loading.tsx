import { useEffect } from 'react';

import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { useGeneratePersonalizedPlan } from '@/data/cache/generatePlan.cache';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

export default function LoadingScreen() {
  const { state: userInfo } = useAuth();
  const { state: surveyState } = useSurvey();
  const progress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const { mutateAsync: generatePersonalizedPlan } = useGeneratePersonalizedPlan();

  useEffect(() => {
    progress.value = withTiming(100, { 
      duration: 5000,
      easing: Easing.out(Easing.quad)
    });

    pulseScale.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );

    const generatePlan = async () => {
      try {
        const surveyData = surveyState.data;
        const user = userInfo.user;

        await generatePersonalizedPlan({ surveyData, userInfo: user! });

        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error generating personalized plan:', error);
      }
    };

    generatePlan();

    return () => {
      pulseScale.value = 1;
      progress.value = 0;
    };
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