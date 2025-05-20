// utils/supabase.ts

console.log('[Supabase Module] This module is being loaded');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto'; // 必须放最前面

// 从 Constants.expoConfig.extra 获取环境变量
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://your-project-id.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'your-anon-public-key';

// 添加日志检查环境变量是否正确加载
console.log('[Supabase] Initializing with URL:', supabaseUrl);
console.log('[Supabase] Anon key available:', !!supabaseAnonKey);

// 检查是否使用了默认值
if (supabaseUrl === 'https://your-project-id.supabase.co') {
  console.warn('[Supabase] WARNING: Using default URL. Environment variables may not be loaded correctly.');
}

// Add this custom storage implementation - 简化版本避免无限循环
const createCustomStorage = () => {
  console.log('[Supabase] Creating custom storage implementation');
  
  // 针对 web 的简单实现
  if (typeof window !== 'undefined') {
    console.log('[Supabase] Using web storage implementation');
    // 使用 localStorage 作为 web 的存储后端
    return {
      getItem: (key: string): Promise<string | null> => {
        console.log(`[Supabase] Storage getItem: ${key.substring(0, 10)}...`);
        try {
          const item = localStorage.getItem(key);
          return Promise.resolve(item);
        } catch (error) {
          console.error(`[Supabase] localStorage getItem error:`, error);
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string): Promise<void> => {
        console.log(`[Supabase] Storage setItem: ${key.substring(0, 10)}...`);
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          console.error(`[Supabase] localStorage setItem error:`, error);
          return Promise.resolve();
        }
      },
      removeItem: (key: string): Promise<void> => {
        console.log(`[Supabase] Storage removeItem: ${key.substring(0, 10)}...`);
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          console.error(`[Supabase] localStorage removeItem error:`, error);
          return Promise.resolve();
        }
      }
    };
  }
  
  // 针对 React Native 的实现
  console.log('[Supabase] Using AsyncStorage implementation');
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const value = await AsyncStorage.getItem(key);
        console.log(`[Supabase] Storage getItem: ${key.substring(0, 10)}... => ${value ? 'found' : 'not found'}`);
        return value;
      } catch (e) {
        console.error(`[Supabase] Storage getItem error for ${key}:`, e);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        console.log(`[Supabase] Storage setItem: ${key.substring(0, 10)}...`);
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        console.error(`[Supabase] Storage setItem error for ${key}:`, e);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        console.log(`[Supabase] Storage removeItem: ${key.substring(0, 10)}...`);
        await AsyncStorage.removeItem(key);
      } catch (e) {
        console.error(`[Supabase] Storage removeItem error for ${key}:`, e);
      }
    }
  };
};

// 创建Supabase客户端实例
console.log('[Supabase] Creating Supabase client');
let supabase: SupabaseClient;

try {
  supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        storage: createCustomStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
    }
  );
  console.log('[Supabase] Client created successfully');
  
  // 移除模块级别的数据库检查，避免无限循环
  console.log('[Supabase] Client initialized and ready to use');
  
} catch (error) {
  console.error('[Supabase] Failed to create client:', error);
  // 创建一个基本客户端以避免应用崩溃
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder',
    {
      auth: {
        storage: {
          getItem: () => Promise.resolve(null),
          setItem: () => Promise.resolve(),
          removeItem: () => Promise.resolve()
        }
      }
    }
  );
  console.error('[Supabase] Using fallback client');
}

// 导出supabase客户端以便其他文件导入使用
console.log('[Supabase Module] Exporting supabase client');
export { supabase };
