import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FadeTransition from '../../components/FadeTransition';
import Letter from '../../components/Letter';

// 定义信件的类型
interface LetterType {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
}

// 假数据
const MOCK_LETTERS: LetterType[] = [
  {
    id: '1',
    title: '关于人生的思考',
    content: '最近我一直在思考人生的意义，想听听你的看法...',
    date: '2023-11-15',
    sender: 'anonymous1',
  },
  {
    id: '2',
    title: '分享一本好书',
    content: '我最近读了一本很棒的书，叫《原子习惯》，强烈推荐你也读一读...',
    date: '2023-11-10',
    sender: 'anonymous2',
  },
  {
    id: '3',
    title: '职业发展的困惑',
    content: '我在当前工作中遇到了瓶颈，不知道是该继续坚持还是寻找新的机会...',
    date: '2023-11-05',
    sender: 'anonymous3',
  },
];

const Inbox = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [letters] = useState(MOCK_LETTERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterType | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 在组件挂载后设置加载完成
  useEffect(() => {
    // 模拟加载延迟
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleReply = (letter: LetterType) => {
    setSelectedLetter(letter);
    setModalVisible(true);
  };

  const sendReply = () => {
    // 处理回复逻辑，添加空值检查
    if (selectedLetter && replyText.trim()) {
      setIsSending(true);
      setTimeout(() => {
        console.log(`回复信件 ${selectedLetter.id}:`, replyText);
        setModalVisible(false);
        setReplyText('');
        setIsSending(false);
        
        // 添加温柔回馈
        Alert.alert(
          "回信已送出",
          "你的回应如同落叶，已悄悄送达对方的心间。",
          [{ text: "好的" }]
        );
      }, 800);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.introText}>每一封信，都是一次安静的相遇</Text>
      <Text style={styles.title}>信箱</Text>
      
      <FadeTransition visible={isLoaded} duration={400}>
        {letters.length > 0 ? (
          <FlatList
            data={letters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Letter letter={item} onReply={handleReply} />
            )}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>还没有收到信件，像是等待春天的花</Text>
            <TouchableOpacity 
              style={styles.writeButton}
              onPress={() => router.push('/(tabs)/SendLetter')}
            >
              <Text style={styles.writeButtonText}>✍️ 想写些什么？</Text>
            </TouchableOpacity>
          </View>
        )}
      </FadeTransition>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>回信</Text>
            <Text style={styles.modalLetterTitle}>{selectedLetter?.title}</Text>
            
            <TextInput
              style={styles.replyInput}
              placeholder="想回应些什么？轻声细语也能被听见..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>再想想</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalSendButton, !replyText.trim() && styles.modalSendButtonDisabled, isSending && styles.modalSendButtonSending]}
                onPress={sendReply}
                disabled={!replyText.trim() || isSending}
              >
                <Text style={styles.modalSendButtonText}>{isSending ? "正在送出..." : "回应"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6',
    padding: 20,
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
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 20,
  },
  writeButton: {
    backgroundColor: '#f5f2ec',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  writeButtonText: {
    color: '#3e3e3e',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#3e3e3e',
  },
  modalLetterTitle: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 15,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 150,
    marginBottom: 20,
    color: '#3e3e3e',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: '#6e6e6e',
    fontSize: 16,
  },
  modalSendButton: {
    backgroundColor: '#f5f2ec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalSendButtonDisabled: {
    opacity: 0.5,
  },
  modalSendButtonSending: {
    opacity: 0.8,
  },
  modalSendButtonText: {
    color: '#3e3e3e',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Inbox;
