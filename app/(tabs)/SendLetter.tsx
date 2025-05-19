import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SendLetter = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // 处理信件提交逻辑
    console.log('提交的信件:', { title, content });
    Alert.alert(
      "信件已发送",
      "你的信件已成功发送，期待收到回复！",
      [
        { text: "确定", onPress: () => router.back() }
      ]
    );
  };

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>写一封信</Text>
        <Text style={styles.subtitle}>分享你的想法或故事，会有人收到并回复你</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>信件标题</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="给你的信件起个标题..."
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          
          <Text style={styles.label}>信件内容</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="写下你想分享的内容..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>发送信件</Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    lineHeight: 22,
  },
  formContainer: {
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 200,
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

export default SendLetter;
