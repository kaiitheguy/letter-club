import SoftButton from '@/components/SoftButton';
import { applyToActivity, getActivities } from '@/lib/supabaseApi';
import { Activity } from '@/lib/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const ApplyActivity = () => {
  const params = useLocalSearchParams();
  const { activityId } = params;
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchActivity() {
      if (!activityId) {
        router.back();
        return;
      }
      
      // 获取所有活动，然后找到指定ID的活动
      const activities = await getActivities();
      const foundActivity = activities.find(a => a.id === activityId);
      
      if (foundActivity) {
        setActivity(foundActivity);
      } else {
        Alert.alert("未找到活动", "请返回活动列表重试");
        router.back();
      }
    }
    
    fetchActivity();
  }, [activityId]);

  const handleSubmit = async () => {
    if (!activityId || !isFormValid) return;
    
    setIsSubmitting(true);
    
    // 实际应用中，可以额外保存申请原因和联系方式到其他表
    const success = await applyToActivity(activityId as string);
    
    setIsSubmitting(false);
    
    if (success) {
      Alert.alert(
        "申请已提交",
        "你的参与请求已悄悄送出，静待回音",
        [{ text: "好的", onPress: () => router.back() }]
      );
    } else {
      Alert.alert("申请失败", "请稍后再试");
    }
  };

  const isFormValid = name.trim() && reason.trim() && contact.trim();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.introText}>参与，也可以是一种安静的存在</Text>
        <Text style={styles.title}>安静参与</Text>
        
        {activity && (
          <View style={styles.activityInfoContainer}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDetails}>时间：{activity.date}</Text>
            {/* <Text style={styles.activityDetails}>地点：{activity.location}</Text> */}
            <Text style={styles.activityDescription}>{activity.description}</Text>
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
        
        <SoftButton 
          text="🍃 让心意悄悄传递" 
          loadingText="正在轻声传递..." 
          onPress={handleSubmit}
          disabled={!isFormValid}
          isLoading={isSubmitting}
        />
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
