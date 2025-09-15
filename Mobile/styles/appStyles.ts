import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const appStyles = StyleSheet.create({
  container: {
    padding: spacing.lg + spacing.md, // 24 + 16 = 40 ~ previous 35
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
    marginBottom: spacing.md + spacing.sm, // 24 ~ previous 20
    color: colors.primary,
  },
  addButton: {
    alignItems: 'flex-end',
  },
});
