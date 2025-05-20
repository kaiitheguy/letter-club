import { supabase } from '../utils/supabase';
import { Activity, Letter, User, UserProfile } from './types';

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
    // 获取当前认证会话
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw authError || new Error('No active session');
    }

    // 查询用户信息
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
 * 获取用户的完整资料
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error('未找到用户');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.user.id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('获取用户资料错误:', error);
    return null;
  }
};

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
