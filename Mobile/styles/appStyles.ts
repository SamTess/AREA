import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const appStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg + spacing.md,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.title,
    marginBottom: spacing.xl,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.subtitle,
    marginBottom: spacing.md + spacing.sm,
    color: colors.primary,
  },
  addButton: {
    alignItems: 'flex-end',
  },
});
