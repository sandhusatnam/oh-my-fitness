import React from 'react';

import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '@/constants/theme';
import { Meal } from '@/types/userWithPlan.type';

interface MealModalProps {
  visible: boolean;
  meal: Meal | null;
  onClose: () => void;
}

const MealModal: React.FC<MealModalProps> = ({ visible, meal, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {!!meal && (
            <>
              <Text style={styles.modalTitle}>{meal.meal_type}</Text>
              <Image source={{ uri: meal.imageUrl }} style={styles.modalImage} resizeMode="cover" />
              <Text style={styles.modalDescription}>{meal.description}</Text>
              <Text style={styles.modalMacros}>Calories: {meal.macros?.calories}</Text>
              <Text style={styles.modalMacros}>Protein: {meal.macros?.protein}g</Text>
              <Text style={styles.modalMacros}>Carbs: {meal.macros?.carbs}g</Text>
              <Text style={styles.modalMacros}>Fat: {meal.macros?.fat}g</Text>
            </>
          )}
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
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  modalDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  modalMacros: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
    alignSelf: 'center'
  },
  closeButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
});

export default MealModal;