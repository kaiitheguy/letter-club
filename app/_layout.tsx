import Constants from 'expo-constants';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { supabase } from '../utils/supabase';

// 从 Constants.expoConfig.extra 获取环境变量
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

console.log('[App] Supabase instance available:', !!supabase);
console.log('[App] Environment variables:', {
  SUPABASE_URL: SUPABASE_URL || 'not set',
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? 'available' : 'not set'
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const initialized = useRef(false);
  const authListener = useRef<any>(null);
  
  // 当前路由是否已经是登录页面
  const isOnLoginScreen = segments[0] === 'Login';
  
  // 初始化 - 只运行一次
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // 检查会话状态
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          setIsLoggedIn(false);
          return;
        }
        
        const loggedIn = !!data?.session;
        setIsLoggedIn(loggedIn);
        
      } catch (error) {
        console.error('Session check exception:', error);
        setIsLoggedIn(false);
      }
    };
    
    // 设置认证状态变化监听
    const setupAuthListener = () => {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          setIsLoggedIn(true);
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
        }
      });
      
      authListener.current = data;
    };
    
    // 设置超时处理
    const timeoutId = setTimeout(() => {
      if (isLoggedIn === null) {
        console.warn('Auth check timed out after 8 seconds');
        setIsLoggedIn(false);
      }
    }, 8000);
    
    checkSession();
    setupAuthListener();
    
    return () => {
      clearTimeout(timeoutId);
      // 清理监听器
      if (authListener.current) {
        authListener.current?.subscription?.unsubscribe?.();
      }
    };
  }, []);
  
  // 处理路由逻辑 - 当登录状态变化或已经在登录页面时触发
  useEffect(() => {
    // 如果状态未确定，不做任何操作
    if (isLoggedIn === null) return;
    
    // 未登录且不在登录页面 - 跳转到登录
    if (!isLoggedIn && !isOnLoginScreen && !redirecting) {
      setRedirecting(true);
      
      // 防止重复导航
      setTimeout(() => {
        router.replace('/Login');
        // 重置redirecting状态以允许将来的重定向
        setTimeout(() => setRedirecting(false), 1000);
      }, 0);
    }
    
    // 已登录但在登录页面 - 跳转到主页
    if (isLoggedIn && isOnLoginScreen && !redirecting) {
      setRedirecting(true);
      
      setTimeout(() => {
        router.replace('/(tabs)');
        // 重置redirecting状态以允许将来的重定向
        setTimeout(() => setRedirecting(false), 1000);
      }, 0);
    }
  }, [isLoggedIn, isOnLoginScreen, redirecting]);

  // 加载状态
  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c757d" />
      </View>
    );
  }

  // 渲染适当的内容
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f4e9', // 米白色背景
  },
});
