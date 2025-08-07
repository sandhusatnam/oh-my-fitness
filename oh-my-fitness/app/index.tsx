import React, { useEffect } from 'react';

import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

import { theme } from '@/constants/theme';
import { Button } from '@/components/common/Button';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const floatAnimation = useSharedValue(0);

  useEffect(() => {
    floatAnimation.value = withTiming(1, {
                                duration: 3000,
                                easing: Easing.inOut(Easing.sin),
                            })
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: floatAnimation.value * 10,
        },
      ],
    };
  });

  const handleGetStarted = () => {
      router.push('/survey');
  };

  return (
      <SafeAreaView>
          <View>
          <Animated.View 
            entering={FadeInUp.delay(300).duration(800)}
            style={[styles.imageContainer, animatedImageStyle]}
          >
            <Image
              source={require('../assets/images/GetStarted.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(600).duration(800)}
            style={styles.textContainer}
          >
            <Text style={styles.title}>
              Your Personalized{'\n'}
              Fitness Journey Starts{'\n'}
              Here
            </Text>
            <Text style={styles.subtitle}>
              Get tailored workout and nutrition plans{'\n'}
              powered by AI to help you achieve your{'\n'}
              health goals.
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(900).duration(800)}
            style={styles.buttonContainer}
          >
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
            />
            <TouchableOpacity onPress={() => router.push({ pathname: '/auth', params: { from: 'welcome' } })} style={{ marginTop: 16, alignSelf: 'center' }}>
              <Text style={{ color: theme.colors.primary, fontWeight: theme.fontWeight.semibold, fontSize: theme.fontSize.md }}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: 1.6,
    height: height * 0.35,
    alignSelf: 'center',
    marginBottom: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: theme.fontSize.xxxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  getStartedButton: {
    width: '100%',
  },
});