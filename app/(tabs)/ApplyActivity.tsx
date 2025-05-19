import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ActivityProps } from '../../components/Activity';

// 根据Activity组件中的实际类型定义重写
type ActivityData = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  isRegistrationOpen?: boolean;
  capacity?: number;
  registered?: number;
};

// 假数据
const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: '1',
    title: '城市夜景摄影沙龙',
    date: '2023-12-10 19:00',
    location: '艺术中心',
    description: '一起探讨城市夜景摄影技巧，分享作品，结交志同道合的朋友。',
    isRegistrationOpen: true,
    capacity: 20,
    registered: 12,
  },
  {
    id: '2',
    title: '文学交流会',
    date: '2023-12-15 14:00',
    location: '中央图书馆',
    description: '讨论最近阅读的书籍，交流心得，推荐好书。',
    isRegistrationOpen: true,
    capacity: 15,
    registered: 15, // 已满
  },
  {
    id: '3',
    title: '咖啡品鉴工作坊',
    date: '2023-12-20 10:00',
    location: 'Blue Coffee',
    description: '专业咖啡师带你了解不同产地的咖啡豆，学习品鉴方法。',
    isRegistrationOpen: false, // 已结束
    capacity: 10,
    registered: 8,
  },
];

const ApplyActivity = () => {
  const params = useLocalSearchParams();
  const { activityId } = params;
  
  const [activity, setActivity] = useState<ActivityProps | null>(null);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 获取活动详情
    const foundActivity = MOCK_ACTIVITIES.find(item => item.id === activityId);
    if (foundActivity) {
      setActivity({
        ...foundActivity,
        activity: foundActivity,
      } as ActivityProps);
    }
  }, [activityId]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // 处理申请提交逻辑
    setTimeout(() => {
      console.log('提交的申请:', { activityId, name, reason, contact });
      Alert.alert(
        "邀请已送达",
        "你的心意已被悄悄收藏，我们会用心回应。",
        [
          { text: "好的", onPress: () => router.back() }
        ]
      );
      setIsSubmitting(false);
    }, 800);
  };

  const isFormValid = name.trim() && reason.trim() && contact.trim();

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>正在静静等待...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.introText}>参与，也可以是一种安静的存在</Text>
        <Text style={styles.title}>安静参与</Text>
        
        {activity && (
          <View style={styles.activityInfoContainer}>
            <Text style={styles.activityTitle}>{activity.activity.title}</Text>
            <Text style={styles.activityDetails}>时间：{activity.activity.date}</Text>
            <Text style={styles.activityDetails}>地点：{activity.activity.location}</Text>
            <Text style={styles.activityDescription}>{activity.activity.description}</Text>
          </View>
        )}
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>你的名字</Text>
          <TextInput
            style={styles.input}
            placeholder="仅活动组织者可见..."
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.label}>你想参与的原因</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="你来，是因为？"
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
          
          <Text style={styles.label}>联系方式</Text>
          <TextInput
            style={styles.input}
            placeholder="一个能找到你的方式..."
            value={contact}
            onChangeText={setContact}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            !isFormValid && styles.buttonDisabled,
            isSubmitting && styles.buttonSubmitting
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "正在轻声传递..." : "🍃 让心意悄悄传递"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6e6e6e',
    fontStyle: 'italic',
  },
  introText: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#3e3e3e',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#3e3e3e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#3e3e3e',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 150,
    marginBottom: 20,
    color: '#3e3e3e',
  },
  button: {
    backgroundColor: '#f5f2ec',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonSubmitting: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#3e3e3e',
    fontSize: 16,
    fontWeight: '500',
  },
  activityInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#3e3e3e',
  },
  activityDetails: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 16,
    color: '#6e6e6e',
  },
});

export default ApplyActivity;
