import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FadeTransition from './FadeTransition';

interface SoftButtonProps {
  onPress: () => void;
  text: string;
  loadingText?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const SoftButton: React.FC<SoftButtonProps> = ({
  onPress,
  text,
  loadingText = "正在处理...",
  disabled = false,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        isLoading && styles.buttonLoading
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      <FadeTransition visible={!isLoading} duration={300}>
        <Text style={styles.buttonText}>{text}</Text>
      </FadeTransition>
      
      <FadeTransition visible={isLoading} duration={300} style={styles.loadingTextContainer}>
        <Text style={styles.buttonText}>{loadingText}</Text>
      </FadeTransition>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f5f2ec',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    minHeight: 54,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#3e3e3e',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingTextContainer: {
    position: 'absolute',
  },
});

export default SoftButton;
