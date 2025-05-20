import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { supabase } from '../utils/supabase';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: '请输入邮箱和密码',
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('[Auth] Signing in with email and password');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log('[Auth] Login successful');
      Toast.show({
        type: 'success',
        text1: '登录成功',
        text2: '欢迎回来',
      });
      
      router.replace('/(tabs)');
      return true;
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      Toast.show({
        type: 'error',
        text1: '登录失败',
        text2: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: '请填写完整信息',
        text2: '邮箱和密码不能为空',
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: '密码太短',
        text2: '请使用至少6位字符的密码',
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('[Auth] Signing up with email and password');
      
      // 1. 创建认证账户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('注册过程中出现未知错误');
      }

      console.log('[Auth] Auth account created successfully, user ID:', authData.user.id);
      
      // 重要: 确保用户已经创建后再插入到users表
      const { data: sessionData } = await supabase.auth.getSession();
      
      // 2. 在users表中创建记录 - 添加更多日志以便调试
      console.log('[Auth] Inserting user record to database');
      const userData = {
        id: authData.user.id,  // 确保ID正确
        email: email,
        approved: false,
        created_at: new Date().toISOString(),
      };
      console.log('[Auth] User data to insert:', userData);
      
      const { data: insertData, error: dbError } = await supabase
        .from('users')
        .insert(userData)
        .select();

      if (dbError) {
        console.error('[Auth] Error creating user record:', dbError);
        console.error('[Auth] Error details:', dbError.details, dbError.hint, dbError.code);
        
        // 注册成功但profile创建失败时，尝试再次插入
        Toast.show({
          type: 'warning',
          text1: '账号已创建',
          text2: '保存用户资料失败，请联系客服',
        });
      } else {
        console.log('[Auth] User record created successfully:', insertData);
        Toast.show({
          type: 'success',
          text1: '注册成功',
          text2: '正在跳转至应用主页',
        });
      }
      
      router.replace('/(tabs)');
      return true;
    } catch (error: any) {
      console.error('[Auth] Signup error:', error);
      Toast.show({
        type: 'error',
        text1: '注册失败',
        text2: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string) => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: '请输入邮箱地址',
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('[Auth] Sending magic link to:', email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'expo://login-callback',
        },
      });

      if (error) throw error;
      
      Toast.show({
        type: 'success',
        text1: '登录链接已发送',
        text2: '请查看您的邮箱',
      });
      return true;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '发送失败',
        text2: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    sendMagicLink,
    isLoading,
  };
};
