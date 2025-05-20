import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getCurrentUser, getUserProfile } from '../../lib/supabaseApi';
import { UserProfile } from '../../lib/types';
import { supabase } from '../../utils/supabase';

// 创建动画组件
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function User() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // 为按钮添加动画效果
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // 按钮动画效果
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/Login');
        return;
      }
      
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('加载用户数据错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/Login');
    } catch (error) {
      console.error('登出错误:', error);
    }
  };

  const handleTestButton = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        console.log('当前用户信息:', {
          id: data.user.id,
          email: data.user.email
        });
      } else {
        console.log('未登录');
      }
    } catch (error) {
      console.error('获取用户信息错误:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6c7a89" />
        <Text style={styles.loadingText}>正在打开信封...</Text>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {!profile ? (
          <Text style={styles.message}>无法获取用户信息</Text>
        ) : !profile.approved ? (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingTitle}>等待批准</Text>
            <Text style={styles.message}>
              你已经进入了门廊，接下来请等待我们回信。
            </Text>
          </View>
        ) : (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>欢迎回来</Text>
            <Text style={styles.penName}>笔名 {profile.pen_name}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <AnimatedTouchable 
            style={[
              styles.testButton,
              { transform: [{ scale: buttonScale }] }
            ]} 
            onPress={handleTestButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>测试用户信息</Text>
          </AnimatedTouchable>
          
          <AnimatedTouchable 
            style={[
              styles.signOutButton,
              { transform: [{ scale: buttonScale }] }
            ]} 
            onPress={handleSignOut}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>退出登录</Text>
          </AnimatedTouchable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4e9',  // 米白色背景
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    backgroundColor: '#f8f4e9',  // 保持加载页面的背景色一致
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7d8b98',  // 温和的灰蓝色
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 30,
    backgroundColor: '#fffcf7',  // 更温暖的米白色
    borderRadius: 18,
    shadowColor: '#8a7e66',  // 更温暖的阴影色
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(210, 200, 180, 0.2)',  // 纸质边框感
  },
  pendingContainer: {
    alignItems: 'center',
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  pendingTitle: {
    fontSize: 22,
    color: '#6b8096',  // 灰蓝色
    marginBottom: 18,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
    letterSpacing: 0.5,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#6b7a89',  // 灰蓝色
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
    letterSpacing: 0.5,
  },
  penName: {
    fontSize: 28,
    color: '#797056',  // 温暖棕色
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
    letterSpacing: 0.7,
  },
  message: {
    fontSize: 17,
    color: '#6c7a89',  // 灰蓝色
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Light' : 'sans-serif-light',
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 25,
    gap: 14,
  },
  testButton: {
    width: '100%',
    height: 48,  // 确保点击区域足够大
    backgroundColor: '#a4b0be',  // 柔和的灰蓝色
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8a7e66',  
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  signOutButton: {
    width: '100%',
    height: 48,  // 确保点击区域足够大
    backgroundColor: '#8aa99b',  // 温和的灰绿色
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8a7e66',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: '#fffcf7',  // 米白色文字
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    letterSpacing: 0.5,
  },
});
