import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import FadeTransition from '../components/FadeTransition';

import { useColorScheme } from '@/hooks/useColorScheme';

// 创建一个淡入淡出的页面过渡效果
const FadeIn = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <FadeTransition visible={visible} duration={300}>
      <View style={{ flex: 1 }}>{children}</View>
    </FadeTransition>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular': 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap',
    'PlayfairDisplay-Bold': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap',
  });

  if (!fontsLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#fdfaf6' },
          // 使用自定义过渡组件
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{ 
            title: '',
            headerTransparent: true,
          }}
        />
        {/* 为特定页面添加淡入淡出效果 */}
        <Stack.Screen
          name="SendLetter"
          options={{ 
            title: '',
            headerTransparent: true,
            presentation: 'transparentModal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// 在全局样式中定义主题色和过渡动画
export const globalStyles = {
  colors: {
    background: '#fdfaf6', // 米白色背景
    buttonBg: '#f5f2ec',   // 按钮背景色（浅米色）
    text: '#3e3e3e',
    subtitle: '#6e6e6e',
  },
  animations: {
    transition: '0.3s',  // 缓慢过渡动画时间
  }
};
