import React, { useState } from 'react';

import { router } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Input } from '@/components/common';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useGetUserWithPlan } from '@/data/cache/getUserProfile.cache';
import { useUpdateWeight } from '@/data/cache/updateWeight.cache';
import { formatDateYMD } from '@/utils/date.util';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { state, logout } = useAuth();
  const { data: userWithPlan } = useGetUserWithPlan();
  const user = userWithPlan?.user;
  const userProfile = user?.profile?.personalGoalsExperience;
  const scheduleAvailability = user?.profile?.scheduleAvailability;
  const dietaryPreferences = user?.profile?.dietaryPreferences;
  const userInfo = user?.userInfo;

  const { mutateAsync: updateWeightAsync, isError: isWeightError } = useUpdateWeight();
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightError, setWeightError] = useState<string | null>(null);


  // Use weight history from userWithPlan.user.progress if available
  const progressWeightHistory = user?.progress?.weightHistory || [];
  const latestWeight = progressWeightHistory.length > 0
    ? progressWeightHistory[progressWeightHistory.length - 1].weight
    : userProfile?.currentWeightLbs;
  const [weightInput, setWeightInput] = useState(latestWeight ? String(latestWeight) : '');

  const handleLogout = async () => {
    
    await logout();
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('/auth');

      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                console.log('Logout successful, navigating to /');
                Alert.alert('Logged out', 'You have been logged out.');
                router.replace('/');
              } catch (e) {
                console.error('Logout error:', e);
                Alert.alert('Logout failed', 'There was a problem logging out.');
              }
            },
          },
        ]
    );
  };

  // Update weight input if user/profile changes
  React.useEffect(() => {
    setWeightInput(latestWeight ? String(latestWeight) : '');
  }, [latestWeight]);

  const handleSaveWeight = async () => {
    setWeightError(null);
    const weight = Number(weightInput);
    if (isNaN(weight) || weight <= 0) {
      setWeightError('Please enter a valid weight.');
      return;
    }
    try {
      await updateWeightAsync({
        date: formatDateYMD(new Date()),
        weight,
      });
      setEditingWeight(false);
    } catch (e) {
      setWeightError('Failed to update weight.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account" size={40} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.userName}>{userInfo?.name || ''}</Text>
            <Text style={styles.userEmail}>{userInfo?.email || ''}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionHeader}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{userProfile?.heightCms ? `${userProfile.heightCms} cm` : '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Weight</Text>
              {editingWeight ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    value={weightInput}
                    onChangeText={setWeightInput}
                    keyboardType="numeric"
                    style={{ width: 80, marginRight: 8 }}
                    placeholder="Weight"
                    error={weightError || (isWeightError ? 'Failed to update weight.' : undefined)}
                  />
                  <TouchableOpacity onPress={handleSaveWeight} style={{ marginRight: 8 }}>
                    <MaterialCommunityIcons name="check" size={24} color={theme.colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingWeight(false)}>
                    <MaterialCommunityIcons name="close" size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.infoValue}>{latestWeight ? `${latestWeight} lbs` : '-'}</Text>
                  <TouchableOpacity onPress={() => setEditingWeight(true)} style={{ marginLeft: 8 }}>
                    <MaterialCommunityIcons name="pencil" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Desired Weight</Text>
              <Text style={styles.infoValue}>{userProfile?.desiredWeightLbs ? `${userProfile.desiredWeightLbs} lbs` : '-'}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionHeader}>Goals</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Primary Goal</Text>
              <Text style={styles.infoValue}>{userProfile?.primaryFitnessGoal || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Workout Frequency</Text>
                <Text style={styles.infoValue}>
                {scheduleAvailability?.daysPerWeekWorkout
                  ? `${scheduleAvailability.daysPerWeekWorkout} times a week`
                  : '-'}
                </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionHeader}>Preferences</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dietary Preference</Text>
              <Text style={styles.infoValue}>{dietaryPreferences?.primaryDietaryPreference || '-'}</Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={20} color={theme.colors.error} />
              <Text style={[styles.menuText, { color: theme.colors.error }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  userName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginLeft: 2,
  },
  menuSection: {
    gap: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  menuText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.lg,
    fontWeight: theme.fontWeight.medium,
  },
});