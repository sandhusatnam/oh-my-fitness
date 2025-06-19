import React, { FC, useEffect } from 'react';

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  interpolateColor,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { theme } from '@/constants/theme';

interface CheckboxItemProps {
  title: string;
  checked: boolean;
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

export const CheckboxItem: FC<CheckboxItemProps> = ({
  title,
  checked,
  onPress,
}) => {
  const checkedValue = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    checkedValue.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked]);

  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checkedValue.value,
      [0, 1],
      ['transparent', theme.colors.primary],
    );

    const borderColor = interpolateColor(
      checkedValue.value,
      [0, 1],
      [theme.colors.borderDark, theme.colors.primary]
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: withSpring(checked ? 1 : 0.8) }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: checkedValue.value,
      transform: [{ scale: checkedValue.value }],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AnimatedView style={[styles.checkbox, checkboxStyle]}>
        <Animated.View style={iconStyle}>
          <Feather name="check" size={16} color={theme.colors.backgroundWhite} />
        </Animated.View>
      </AnimatedView>
      <Text style={styles.title}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
});