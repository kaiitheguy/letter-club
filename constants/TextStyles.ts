import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  introText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 25,
    fontStyle: 'italic',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    marginBottom: 10,
    color: Colors.light.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 30,
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.light.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.light.textPrimary,
  },
});
