import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCurrentUser, getUserProfile } from '../../lib/supabaseApi';
import { UserProfile } from '../../lib/types';
import { supabase } from '../../utils/supabase';

export default function User() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
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
        <ActivityIndicator size="large" color="#6a7b8c" />
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
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleTestButton}
          >
            <Text style={styles.buttonText}>测试用户信息</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  pendingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6a7b8c',
    marginBottom: 15,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  penName: {
    fontSize: 26,
    fontWeight: '600',
    color: '#6a7b8c',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  testButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#8ea0b2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#6a7b8c',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
