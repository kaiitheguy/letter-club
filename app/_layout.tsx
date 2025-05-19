import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
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
