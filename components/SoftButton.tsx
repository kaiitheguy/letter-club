import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import FadeTransition from './FadeTransition';

interface SoftButtonProps {
  onPress: () => void;
  text: string;
  loadingText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const SoftButton: React.FC<SoftButtonProps> = ({
  onPress,
  text,
  loadingText = "正在轻声处理...",
  disabled = false,
  isLoading = false,
  style,
  textStyle,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        isLoading && styles.buttonLoading,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7} // 轻微的按下反馈
    >
      <FadeTransition visible={!isLoading} duration={300}>
        <Text style={[styles.buttonText, textStyle]}>
          {icon && <Text style={styles.iconText}>{icon} </Text>}
          {text}
        </Text>
      </FadeTransition>
      
      <FadeTransition visible={isLoading} duration={300} style={styles.loadingContainer}>
        <Text style={[styles.buttonText, textStyle]}>{loadingText}</Text>
      </FadeTransition>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.button,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    minHeight: 54,
    marginBottom: 15,
    // 添加轻微的浮起动画的准备
    transform: [{ translateY: 0 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    color: Colors.light.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginRight: 4,
  }
});

export default SoftButton;
