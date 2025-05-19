import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const WelcomeScreen = () => {
  const [letter, setLetter] = useState('');

  const handleSubmit = () => {
    // 处理提交逻辑
    console.log('提交的申请信:', letter);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>欢迎来到匿名信件沙龙</Text>
        <Text style={styles.subtitle}>
          请写下你的第一封申请信，告诉我们你为什么想加入这个平台
        </Text>
        
        <View style={styles.letterContainer}>
          <TextInput
            style={styles.letterInput}
            placeholder="写下你的申请信..."
            value={letter}
            onChangeText={setLetter}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, letter.trim().length < 10 && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={letter.trim().length < 10}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  letterInput: {
    height: 200,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#3A86FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
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

export default WelcomeScreen;
