import { useState } from 'react';

import { router } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/common';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '@/constants/app';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { showToast } from '@/utils/ToastHelper';

export default function RegisterScreen() {
  const { register, state } = useAuth();
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
    } else if (!EMAIL_REGEX.test(email.trim())) {
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

  const handleRegister = async () => {
    Toast.hide();
    if (!validateForm()) return;

    try {
      await register(name.trim(), email.trim(), password);
      router.push('/loading');

    } catch (error: any) {
      showToast( 'error' , error.message || 'Please try again.');
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