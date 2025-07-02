import React from 'react';

import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';

import { theme } from '@/constants/theme';
import { Exercise } from '@/types/userWithPlan.type';

interface WorkoutModalProps {
  visible: boolean;
  exercises: Exercise[] | null;
  onClose: () => void;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ visible, exercises, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScrollView}>
            {
              exercises?.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Image source={{ uri: exercise.imageUrl }} style={styles.exerciseImage} resizeMode="cover" />
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>{`Sets: ${exercise.sets}, Reps: ${exercise.reps}`}</Text>
                </View>
              ))
            }
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundWhite,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  modalScrollView: {
    width: '100%',
    flex: 1,
  },
  exerciseItem: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  exerciseDetails: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  exerciseImage: {
    width: '100%',
    height: 150,
    borderRadius: theme.borderRadius.md,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  closeButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
});

export default WorkoutModal;