import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

interface FadeProps extends ViewProps {
  visible: boolean;
  duration?: number;
  children: React.ReactNode;
}

const FadeTransition: React.FC<FadeProps> = ({ 
  visible, 
  duration = 300, 
  children,
  style,
  ...props 
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity, duration]);

  return (
    <Animated.View
      style={[
        { opacity },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default FadeTransition;
