import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
export const normalize = (size: number) => {
  const scale = width / 375; // iPhone X width as base
  const newSize = size * scale;
  return Math.round(newSize);
};

export const normalizeHeight = (size: number) => {
  const scale = height / 812; // iPhone X height as base
  const newSize = size * scale;
  return Math.round(newSize);
};

export const Theme = {
  // Spacing
  spacing: {
    xs: normalize(4),
    sm: normalize(8),
    md: normalize(16),
    lg: normalize(24),
    xl: normalize(32),
    xxl: normalize(48),
  },

  // Typography
  typography: {
    h1: {
      fontSize: normalize(32),
      fontWeight: '800' as const,
      lineHeight: normalize(40),
    },
    h2: {
      fontSize: normalize(28),
      fontWeight: '700' as const,
      lineHeight: normalize(36),
    },
    h3: {
      fontSize: normalize(24),
      fontWeight: '600' as const,
      lineHeight: normalize(32),
    },
    h4: {
      fontSize: normalize(20),
      fontWeight: '600' as const,
      lineHeight: normalize(28),
    },
    body: {
      fontSize: normalize(16),
      fontWeight: '400' as const,
      lineHeight: normalize(24),
    },
    caption: {
      fontSize: normalize(14),
      fontWeight: '400' as const,
      lineHeight: normalize(20),
    },
    small: {
      fontSize: normalize(12),
      fontWeight: '400' as const,
      lineHeight: normalize(16),
    },
  },

  // Border radius
  borderRadius: {
    sm: normalize(4),
    md: normalize(8),
    lg: normalize(12),
    xl: normalize(16),
    round: normalize(999),
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },

  // Layout
  layout: {
    screenPadding: normalize(20),
    cardPadding: normalize(16),
    sectionSpacing: normalize(24),
  },
};
