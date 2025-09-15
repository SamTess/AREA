export const colors = {
  primary: 'purple',
  danger: 'crimson',
  text: '#222',
  muted: '#777',
  background: '#a0c44dff',
  error: 'red',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const typography = {
  title: 40,
  subtitle: 20,
  base: 16,
};

export const theme = {
  colors,
  spacing,
  typography,
};

export type Theme = typeof theme;
