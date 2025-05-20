import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import FadeTransition from '@/components/FadeTransition';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// 轻微的淡入效果用于标签页切换
const FadeTabView = ({ children, isFocused }: { children: React.ReactNode; isFocused: boolean }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isFocused) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isFocused]);
  
  return (
    <FadeTransition visible={visible} duration={400}>
      <View style={{ flex: 1 }}>{children}</View>
    </FadeTransition>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [visible, setVisible] = useState(true);
  
  // 页面加载时的淡入效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <FadeTransition visible={visible} duration={400} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6c7a89',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            ...Platform.select({
              ios: {
                position: 'absolute',
              },
              default: {},
            }),
            backgroundColor: Colors.light.background,
            borderTopColor: 'rgba(0,0,0,0.03)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.03,
            shadowRadius: 3,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '400',
            paddingBottom: 4,
          },
          tabBarInactiveTintColor: Colors.light.textSecondary,
        }}>
        <Tabs.Screen
          name="WelcomeScreen"
          options={{
            title: '轻语之所',
            tabBarIcon: ({ color }) => <IconSymbol size={22} name="moon.stars.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="SendLetter"
          options={{
            title: '寄语远方',
            tabBarIcon: ({ color }) => <IconSymbol size={22} name="pencil.and.outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Inbox"
          options={{
            title: '静听回音',
            tabBarIcon: ({ color }) => <IconSymbol size={22} name="envelope.open.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="ActivityList"
          options={{
            title: '安静角落',
            tabBarIcon: ({ color }) => <IconSymbol size={22} name="leaf.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="ApplyActivity"
          options={{
            title: '安静参与',
            tabBarIcon: ({ color }) => <IconSymbol size={22} name="hand.raised.fill" color={color} />,
            // href: null,
          }}
        />
        <Tabs.Screen
          name="User"
          options={{
            title: '个人信笺',
            tabBarIcon: ({ color }) => <IconSymbol size={22} name="person.crop.circle" color={color} />,
          }}
        />
      </Tabs>
    </FadeTransition>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fdfaf6',
    borderTopColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 5,
  }
});
