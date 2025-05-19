import SoftButton from '@/components/SoftButton';
import Colors from '@/constants/Colors';
import TextStyles from '@/constants/TextStyles';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
        <Text style={[TextStyles.introText, styles.introText]}>这封信只需要你一个人的声音</Text>
        <Text style={TextStyles.title}>寄语远方</Text>
        <Text style={[TextStyles.subtitle, styles.subtitle]}>你的文字会找到它的归宿</Text>
        
        <View style={styles.formContainer}>
          <Text style={TextStyles.label}>标题</Text>
          <TextInput
            style={[TextStyles.input, styles.titleInput]}
            placeholder="这封信想被如何记住？"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          
          <Text style={TextStyles.label}>内容</Text>
          <TextInput
            style={[TextStyles.input, styles.contentInput]}
            placeholder="你想对世界说的悄悄话..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <SoftButton 
          text="📮 让文字找到归处" 
          loadingText="正在飘向远方..." 
          onPress={handleSubmit}
          disabled={!isFormValid}
          isLoading={isSubmitting}
        />
        
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
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  introText: {
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    shadowColor: Colors.light.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleInput: {
    // 特定的覆盖样式（如有需要）
  },
  contentInput: {
    height: 200,
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
