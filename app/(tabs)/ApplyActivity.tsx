import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Activity, { ActivityProps } from '../../components/Activity';

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

  useEffect(() => {
    // 获取活动详情
    const foundActivity = MOCK_ACTIVITIES.find(item => item.id === activityId);
    if (foundActivity) {
      // Convert foundActivity to match ActivityProps type
      setActivity({
        ...foundActivity,
        activity: foundActivity, // Add the required 'activity' property
        // Add any required properties from ActivityProps that might be missing in ActivityData
      } as ActivityProps);
    }
  }, [activityId]);

  const handleSubmit = () => {
    // 处理申请提交逻辑
    console.log('提交的申请:', { activityId, name, reason, contact });
    Alert.alert(
      "申请已提交",
      "你的活动申请已成功提交，我们会尽快处理！",
      [
        { text: "确定", onPress: () => router.back() }
      ]
    );
  };

  const isFormValid = name.trim() && reason.trim() && contact.trim();

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>暂无活动</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>活动申请</Text>
        
        <Activity 
          activity={activity.activity}
          showApplyButton={false}
          showStatus={false}
        />
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>你的名字</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入你的名字"
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.label}>申请理由</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="请简述你参加活动的原因和期望..."
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
          
          <Text style={styles.label}>联系方式</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号码或邮箱"
            value={contact}
            onChangeText={setContact}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>提交申请</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 150,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3A86FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#B8C7E5',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApplyActivity;
