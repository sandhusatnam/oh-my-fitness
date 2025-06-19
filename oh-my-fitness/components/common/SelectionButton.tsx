import React, { FC, useEffect } from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  interpolateColor,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { theme } from '@/constants/theme';

interface SelectionButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const SelectionButton: FC<SelectionButtonProps> = ({
  title,
  selected,
  onPress,
  multiSelect = false,
}) => {
  const scale = useSharedValue(1);
  const selectedValue = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    selectedValue.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selectedValue.value,
      [0, 1],
      [theme.colors.backgroundSecondary, theme.colors.primary]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
      borderColor: selected ? theme.colors.primary : theme.colors.border,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectedValue.value,
      [0, 1],
      [theme.colors.textPrimary, theme.colors.textInverse]
    );

    return { color };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.Text style={[styles.text, textStyle]}>{title}</Animated.Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    margin: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});