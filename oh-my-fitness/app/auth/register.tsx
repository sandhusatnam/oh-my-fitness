import React, { useState } from 'react';

import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Input, Button } from '@/components/common';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '@/constants/app';

export default function RegisterScreen() {
  const { register, state } = useAuth();
  const { state: surveyState } = useSurvey();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (EMAIL_REGEX.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePersonalizedPlan = async (userToken: string) => {
    try {
      // Simulate API call to generate personalized plan
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          surveyData: surveyState.data,
          userInfo: { name, email }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const planData = await response.json();
      return planData;
    } catch (error) {
      console.error('Plan generation error:', error);
      throw error;
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      const authResult = await register(name, email, password);
      console.log({authResult})
      await generatePersonalizedPlan(authResult.token);
      
      router.push('/loading');
      
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.brand}>Oh My Fitness!</Text>
          
          <Text style={styles.title}>
            Start your journey to a healthier you
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            
            <Button
              title={state.isLoading ? "Generating Your Plan..." : "Sign Up"}
              onPress={handleRegister}
              disabled={state.isLoading}
              style={styles.registerButton}
            />
          </View>
          
          <Text style={styles.termsText}>
            By signing up, you agree to our Terms, Privacy Policy and Cookie Use.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
    paddingTop: 20
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.xl
  },
  brand: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  form: {
    marginBottom: 40,
  },
  registerButton: {
    marginTop: theme.spacing.xl,
  },
  termsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});