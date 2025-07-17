import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from '@/components/common';
import { useAuth } from '@/contexts/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { showToast } from '@/utils/ToastHelper';

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const fromWelcome = params.from === 'welcome';
  const { login, state } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      const result = await login(email, password);

      if (!!result?.token) {
        router.push('/(tabs)');
      }
      else{
        showToast('error', 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      showToast('error',
        'Login failed. Please check your credentials and try again.'
      );
    }
  };

  const handleRegister = () => {
    router.push({ pathname: '/auth/register', params: { from: 'login' } })
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {fromWelcome && (
          <TouchableOpacity onPress={() => router.replace('/')} style={{ position: 'absolute', top: 0, left: 0, padding: 16, zIndex: 10 }}>
            <Text style={{ color: theme.colors.primary, fontWeight: theme.fontWeight.bold, fontSize: 18 }}>Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
        
        <View style={styles.form}>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          
          <Button
            title={state.isLoading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            disabled={state.isLoading}
            style={styles.loginButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 60,
  },
  title: {
    fontSize: theme.fontSize.xxxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
  },
  loginButton: {
    marginTop: theme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  linkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
});