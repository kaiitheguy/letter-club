import { checkApprovalStatus, submitApplication } from '@/lib/supabaseApi';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const WelcomeScreen = () => {
  const [letter, setLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查用户是否已经被批准
  useEffect(() => {
    async function checkApproval() {
      const isApproved = await checkApprovalStatus();
      if (isApproved) {
        // 如果用户已被批准，直接跳转到主页
        router.replace('/(tabs)');
      }
    }
    
    checkApproval();
  }, []);

  const handleSubmit = async () => {
    if (letter.trim().length < 10) return;
    
    setIsSubmitting(true);
    
    const success = await submitApplication(letter);
    
    setIsSubmitting(false);
    
    if (success) {
      Alert.alert(
        "邀请函已送出",
        "你的文字像是落叶，已被风轻轻接住。我们很快会回应。",
        [{ text: "好的", onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert("提交失败", "请稍后再试");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.introText}>这是一场无需急于表达的对话</Text>
        <Text style={styles.title}>轻语之所</Text>
        <Text style={styles.subtitle}>
          在这里，你的声音会被温柔地听见
        </Text>
        
        <View style={styles.letterContainer}>
          <TextInput
            style={styles.letterInput}
            placeholder="想对我们说些什么呢？随心而至..."
            value={letter}
            onChangeText={setLetter}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, letter.trim().length < 10 && styles.buttonDisabled, isSubmitting && styles.buttonSubmitting]}
          onPress={handleSubmit}
          disabled={letter.trim().length < 10 || isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? "正在轻轻送出..." : "✉️ 让文字随风而去"}</Text>
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
  introText: {
    fontSize: 16,
    color: '#6e6e6e',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#3e3e3e',
  },
  subtitle: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  letterContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  letterInput: {
    height: 200,
    fontSize: 16,
    lineHeight: 24,
    color: '#3e3e3e',
  },
  button: {
    backgroundColor: '#f5f2ec',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
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
});

export default WelcomeScreen;
