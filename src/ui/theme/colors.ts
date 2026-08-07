export const colors = {
  primary: '#12b4c4',
  primaryDark: '#0e94a1',
  primaryLight: '#e6f8fa',
  
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  surface: '#F1F3F5',
  
  text: {
    primary: '#1A1A1A',
    secondary: '#6C757D',
    muted: '#8A8A8A',
    inverse: '#FFFFFF',
  },

  border: '#E9ECEF',
  inputBorder: '#DEE2E6',

  status: {
    synced: '#22C55E',
    offline: '#8A8A8A',
    pending: '#F59E0B',
    error: '#EF4444',
  },

  badge: {
    greenBg: '#DCFCE7',
    greenText: '#15803D',
    yellowBg: '#FEF9C3',
    yellowText: '#A16207',
    redBg: '#FEE2E2',
    redText: '#B91C1C',
    grayBg: '#F3F4F6',
    grayText: '#4B5563',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
} as const;
