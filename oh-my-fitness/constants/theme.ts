export const theme = {
  colors: {
    primary: '#617AFA',
    primaryDark: '#374151',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Backgrounds
    background: '#E5E7EB',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    backgroundWhite: '#FFFFFF',
    
    // Text
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    textSelected: '#374151',//label, selectionbutton selected value
    
    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Gradients
    gradientStart: '#D0EFFF',
    gradientMiddle: '#A0B9FF',
    gradientEnd: '#FFFFFF'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export type Theme = typeof theme;