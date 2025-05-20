import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase'; // 确保你有这个导入

export default function HomeScreen() {
  const router = useRouter();
  const [penName, setPenName] = useState('');
  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 从数据库获取用户笔名，这里假设你有一个 profiles 表
          const { data, error } = await supabase
            .from('users')
            .select('pen_name')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          if (data?.pen_name) {
            setPenName(data.pen_name);
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    }
    
    fetchUserProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>您好!</Text>
          <Text style={styles.penName}>{penName || '亲爱的用户'}</Text>
          <Text style={styles.welcomeText}>
            今天想要分享些什么呢？
          </Text>
        </View>

        <View style={styles.actionCards}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/(tabs)/SendLetter')}
          >
            <View style={styles.cardContent}>
              <Ionicons name="create-outline" size={30} color="#6c7a89" />
              <Text style={styles.cardTitle}>我要写信</Text>
              <Text style={styles.cardDescription}>
                记录下您的思绪，传递心意
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/(tabs)/Inbox')}
          >
            <View style={styles.cardContent}>
              <Ionicons name="mail-outline" size={30} color="#6c7a89" />
              <Text style={styles.cardTitle}>查看来信</Text>
              <Text style={styles.cardDescription}>
                收到了{/* 这里可以放未读数量 */}封新信件
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/(tabs)/ActivityList')}
          >
            <View style={styles.cardContent}>
              <Ionicons name="calendar-outline" size={30} color="#6c7a89" />
              <Text style={styles.cardTitle}>参与活动</Text>
              <Text style={styles.cardDescription}>
                探索更多有趣的互动
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4e9', // 米白色背景
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  greeting: {
    fontSize: 22,
    color: '#555',
    marginBottom: 8,
  },
  penName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionCards: {
    width: '100%',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});
