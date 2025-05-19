import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.introText}>你不需要立刻说话。慢慢来。</Text>
      <Text style={styles.title}>匿名信件沙龙</Text>
      <Text style={styles.subtitle}>这里是安静的角落，不必急于表达</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigateTo('/SendLetter')}
        >
          <Text style={styles.buttonText}>✍️ 想说点什么？</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigateTo('/Inbox')}
        >
          <Text style={styles.buttonText}>📬 看看有没有来信</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigateTo('/ActivityList')}
        >
          <Text style={styles.buttonText}>🎴 我想安静地加入</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6', // 米白色背景
    padding: 20,
    justifyContent: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#6e6e6e',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    color: '#3e3e3e',
  },
  subtitle: {
    fontSize: 16,
    color: '#6e6e6e',
    textAlign: 'center',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#f5f2ec', // 浅米色按钮
    paddingVertical: 18,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#3e3e3e',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default HomeScreen;
