import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FadeTransition from '../../components/FadeTransition';

const SendLetter = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('提交的信件:', { title, content });
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
        setTimeout(() => {
          router.back();
        }, 300);
      }, 2000);
      
      setIsSubmitting(false);
    }, 800);
  };

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.introText}>这封信只需要你一个人的声音</Text>
        <Text style={styles.title}>寄语远方</Text>
        <Text style={styles.subtitle}>你的文字会找到它的归宿</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>标题</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="这封信想被如何记住？"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          
          <Text style={styles.label}>内容</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="你想对世界说的悄悄话..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled, isSubmitting && styles.buttonSubmitting]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? "正在飘向远方..." : "📮 让文字找到归处"}</Text>
        </TouchableOpacity>
        
        <FadeTransition 
          visible={showSuccessMessage} 
          duration={400}
          style={styles.successMessageContainer}
        >
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>
              你的信被轻轻放进风里了，它会找到一个愿意聆听的人。
            </Text>
          </View>
        </FadeTransition>
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
    color: '#3e3e3e',
  },
  subtitle: {
    fontSize: 16,
    color: '#6e6e6e',
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
  titleInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#3e3e3e',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 200,
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
  successMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 250, 246, 0.95)',
  },
  successMessage: {
    padding: 20,
    borderRadius: 8,
    maxWidth: '80%',
  },
  successMessageText: {
    fontSize: 17,
    color: '#3e3e3e',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default SendLetter;
