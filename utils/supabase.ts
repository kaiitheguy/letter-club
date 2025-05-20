// utils/supabase.ts

console.log('[Supabase Module] This module is being loaded');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto'; // 必须放最前面

// 确保这些值从 Constants 或环境变量中正确获取
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// 验证必需的配置
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 或 API 密钥缺失。请检查环境配置。');
  throw new Error('Supabase configuration missing');
}

// 添加日志检查环境变量是否正确加载
console.log('[Supabase] Initializing with URL:', supabaseUrl);
console.log('[Supabase] Anon key available:', !!supabaseAnonKey);

// 检查是否使用了默认值
if (supabaseUrl === 'https://your-project-id.supabase.co') {
  console.warn('[Supabase] WARNING: Using default URL. Environment variables may not be loaded correctly.');
}

// Create Supabase client with proper type and singleton pattern
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    console.log('[Supabase] Creating new Supabase client');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or API key missing. Check environment config.');
      throw new Error('Supabase configuration missing');
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
};

// Export for backward compatibility
export const supabase = (() => {
  // Add explicit logging of the actual key (first few chars only for security)
  console.log('[Supabase] Creating client with key starting with:', 
    supabaseAnonKey ? `${supabaseAnonKey.substring(0, 3)}...` : 'undefined');
  console.log('[Supabase] URL:', supabaseUrl);
  
  // Create fresh instance with explicit parameters
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
})();

// 提供一个重新初始化客户端的函数，可以在遇到问题时调用
export const reinitializeSupabase = () => {
  // 同样的配置，用于在需要时重新创建客户端
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};

// 导出supabase客户端以便其他文件导入使用
console.log('[Supabase Module] Exporting supabase client');
