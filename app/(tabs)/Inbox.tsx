import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [letters] = useState(MOCK_LETTERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterType | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (letter: LetterType) => {
    setSelectedLetter(letter);
    setModalVisible(true);
  };

  const sendReply = () => {
    // 处理回复逻辑，添加空值检查
    if (selectedLetter) {
      console.log(`回复信件 ${selectedLetter.id}:`, replyText);
      setModalVisible(false);
      setReplyText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>收到的信</Text>
      
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
          <Text style={styles.emptyText}>你还没有收到任何信件</Text>
          <TouchableOpacity 
            style={styles.writeButton}
            // 修正路由路径指向
            onPress={() => router.push('/(tabs)/SendLetter')}
          >
            <Text style={styles.writeButtonText}>写一封信</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>回复信件</Text>
            <Text style={styles.modalLetterTitle}>{selectedLetter?.title}</Text>
            
            <TextInput
              style={styles.replyInput}
              placeholder="写下你的回复..."
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
                <Text style={styles.modalCancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalSendButton, !replyText.trim() && styles.modalSendButtonDisabled]}
                onPress={sendReply}
                disabled={!replyText.trim()}
              >
                <Text style={styles.modalSendButtonText}>发送</Text>
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
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    color: '#666',
    marginBottom: 20,
  },
  writeButton: {
    backgroundColor: '#3A86FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  writeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLetterTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 150,
    marginBottom: 20,
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
    color: '#666',
    fontSize: 16,
  },
  modalSendButton: {
    backgroundColor: '#3A86FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalSendButtonDisabled: {
    backgroundColor: '#B8C7E5',
  },
  modalSendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Inbox;
