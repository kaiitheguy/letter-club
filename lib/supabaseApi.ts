import { supabase } from '../utils/supabase';
import { Activity, UserProfile as ImportedUserProfile, Letter, User } from './types';

// Store the original fetch function
const originalFetch = global.fetch;

// If you've overridden global.fetch, make sure it passes through all headers:
global.fetch = async (url, options = {}) => {
  const urlString = typeof url === 'string' 
    ? url 
    : url instanceof URL 
      ? url.toString() 
      : url instanceof Request 
        ? url.url 
        : '';
        
  if (urlString.includes('supabase')) {
    console.log('[DEBUG] Request URL:', urlString);
    console.log('[DEBUG] Request headers:', JSON.stringify(options?.headers));
  }
  
  // Make sure to call the original fetch with ALL original options
  return originalFetch(url, options);
};

// 发送 magic link 登录请求
export async function loginWithMagicLink(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Magic link login error:', error);
    return false;
  }
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw authError || new Error('No active session');
    }
    
    // Explicitly ensure we have proper headers by using the same client instance
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// 提交申请信
export async function submitApplication(letter: string): Promise<boolean> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw authError || new Error('No active session');
    }
    
    const { error } = await supabase
      .from('users')
      .update({ 
        application_letter: letter,
        // 初次提交申请时默认未批准
        approved: false
      })
      .eq('id', session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Submit application error:', error);
    return false;
  }
}

// 检查用户审批状态
export async function checkApprovalStatus(): Promise<boolean | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    return user.approved;
  } catch (error) {
    console.error('Check approval status error:', error);
    return null;
  }
}

// 发送信件给随机用户
export async function sendLetter(content: string): Promise<boolean> {
  try {
    // 获取当前用户
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw authError || new Error('No active session');
    }

    // 获取3位随机的已批准用户（排除自己）
    const { data: randomUsers, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('approved', true)
      .neq('id', session.user.id)
      .limit(3);

    if (usersError) throw usersError;
    
    // 如果没有足够的用户，至少发给可用的用户
    if (!randomUsers || randomUsers.length === 0) {
      throw new Error('没有可用的收信人');
    }

    // 提取用户ID数组
    const deliveredTo = randomUsers.map(user => user.id);

    // 插入信件
    const { error: letterError } = await supabase
      .from('letters')
      .insert({
        sender_id: session.user.id,
        body: content,
        delivered_to: deliveredTo
      });

    if (letterError) throw letterError;
    return true;
  } catch (error) {
    console.error('Send letter error:', error);
    return false;
  }
}

// 获取收件箱
export async function getInbox(): Promise<Letter[]> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw authError || new Error('No active session');
    }

    // 查询投递给当前用户的信件
    // 注意: 这里假设 delivered_to 是 UUID[]，使用 Postgres 的 array_contains
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .contains('delivered_to', [session.user.id])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Letter[];
  } catch (error) {
    console.error('Get inbox error:', error);
    return [];
  }
}

// 获取未来活动列表
export async function getActivities(): Promise<Activity[]> {
  try {
    const now = new Date().toISOString();
    
    // 查询未来的活动
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .gt('date', now)
      .order('date', { ascending: true });

    if (error) throw error;
    return data as Activity[];
  } catch (error) {
    console.error('Get activities error:', error);
    return [];
  }
}

// 申请参加活动
export async function applyToActivity(activityId: string): Promise<boolean> {
  try {
    // 获取当前用户
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw authError || new Error('No active session');
    }

    // 先获取活动的当前申请者列表
    const { data: activity, error: fetchError } = await supabase
      .from('activities')
      .select('applicants')
      .eq('id', activityId)
      .single();

    if (fetchError) throw fetchError;
    
    // 确保申请者列表存在且当前用户不在列表中
    const currentApplicants = activity.applicants || [];
    if (currentApplicants.includes(session.user.id)) {
      // 用户已经申请了
      return true;
    }
    
    // 更新申请者列表
    const newApplicants = [...currentApplicants, session.user.id];
    const { error: updateError } = await supabase
      .from('activities')
      .update({
        applicants: newApplicants
      })
      .eq('id', activityId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Apply to activity error:', error);
    return false;
  }
}

// 登出用户
export async function logoutUser(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

/**
 * 获取用户笔名
 * @param userId 用户ID
 * @returns 用户笔名或空字符串（如果没有设置）
 */
export async function getUserPenName(userId: string): Promise<string | null> {
  try {
    if (!userId) {
      return null;
    }

    // 简化查询，只获取必要字段
    const { data, error } = await supabase
      .from('users')
      .select('id, email, pen_name')
      .eq('id', userId);
    
    if (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
    
    // 即使没有笔名也返回用户
    if (data && data.length > 0) {
      // 返回笔名或null（如果不存在）
      return data[0].pen_name;
    }
    
    return null;
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return null;
  }
}

/**
 * 获取当前用户的个人资料
 * @returns 用户个人资料或null
 */
export async function getUserProfile(): Promise<ImportedUserProfile | null> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return null;
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    
    // 先通过ID查询
    const { data, error } = await supabase
      .from('users')
      .select('id, email, approved, created_at, pen_name, application_letter')
      .eq('id', userId);
    
    // 检查ID查询结果
    if (!error && data && data.length > 0) {
      return data[0] as ImportedUserProfile;
    }
    
    // 如果ID查询失败，尝试通过邮箱查询
    if (userEmail) {
      const { data: emailData, error: emailError } = await supabase
        .from('users')
        .select('id, email, approved, created_at, pen_name, application_letter')
        .eq('email', userEmail);
      
      if (!emailError && emailData && emailData.length > 0) {
        return emailData[0] as ImportedUserProfile;
      }
    }
    
    // 如果没有找到记录，创建一个新用户记录（只包含必需字段）
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: userEmail,
        approved: false
      })
      .select();
    
    if (insertError) {
      console.error('创建用户记录失败:', insertError);
      return null;
    }
    
    return newUser && newUser.length > 0 ? newUser[0] as ImportedUserProfile : null;
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return null;
  }
}

/**
 * 发送 Magic Link 邮件登录
 */
export const sendMagicLink = async (email: string) => {
  try {
    // 检查是否在浏览器环境
    const redirectTo = typeof window !== 'undefined' 
      ? window.location.origin 
      : undefined;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      }
    });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('发送登录链接错误:', error);
    throw error;
  }
};

/**
 * 登出
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('登出错误:', error);
    throw error;
  }
};

/**
 * 注册新用户并在 users 表中创建对应的用户记录
 * 
 * @param email 用户邮箱
 * @param password 用户密码
 * @returns 成功返回 true，失败返回 false
 */
export async function registerAndInsertUser(email: string, password: string): Promise<boolean> {
  try {
    console.log(`[Supabase] Registering new user: ${email}`);
    
    // 步骤1: 使用 Supabase Auth 注册新用户
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData.user) {
      console.error('[Supabase] Registration failed:', signUpError?.message);
      return false;
    }

    console.log(`[Supabase] User registered successfully. User ID: ${signUpData.user.id}`);

    // 等待会话准备好（通过事件监听）
    return await new Promise((resolve) => {
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`[Supabase] Auth state changed: ${event}`);
          
          if (event === 'SIGNED_IN' && session?.user?.id) {
            console.log('[Supabase] Session ready, inserting user row...');

            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                approved: false,
              });

            // 清理监听器
            listener?.subscription?.unsubscribe();

            if (insertError) {
              console.error('[Supabase] Insert error:', insertError.message);
              console.error('[Supabase] Error details:', {
                code: insertError.code,
                details: insertError.details,
                hint: insertError.hint
              });
              resolve(false);
            } else {
              console.log('[Supabase] User inserted successfully');
              resolve(true);
            }
          }
        }
      );

      // 如果 10 秒后还没触发，直接 fail
      setTimeout(() => {
        listener?.subscription?.unsubscribe();
        console.warn('[Supabase] Timeout waiting for session');
        resolve(false);
      }, 10000);
    });
  } catch (error) {
    console.error('[Supabase] Unexpected error during registration:', error);
    return false;
  }
}

/**
 * 检查用户是否已获得批准
 * 
 * @param userId 用户ID
 * @returns 用户获批状态，出错则返回null
 */
export async function checkUserApprovalStatus(userId: string): Promise<boolean | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('approved')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('[Supabase] Failed to check approval status:', error.message);
      return null;
    }
    
    return data?.approved || false;
  } catch (error) {
    console.error('[Supabase] Error checking approval status:', error);
    return null;
  }
}

// 更新 UserProfile 类型定义，使笔名和申请信字段可选
export interface UserProfile {
  id: string;
  email: string;
  approved: boolean;
  created_at: string;
  pen_name?: string | null;
  application_letter?: string | null;
}
