import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LetterProps {
  letter: {
    id: string;
    title: string;
    content: string;
    date: string;
    sender: string;
  };
  onReply?: (letter: any) => void;
  showReplyButton?: boolean;
}

const Letter = ({ letter, onReply, showReplyButton = true }: LetterProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{letter.title}</Text>
      <Text style={styles.cardDate}>{letter.date}</Text>
      <Text style={styles.cardContent}>{letter.content}</Text>
      
      {showReplyButton && (
        <TouchableOpacity 
          style={styles.replyButton} 
          onPress={() => onReply && onReply(letter)}
        >
          <Text style={styles.replyButtonText}>回复</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    color: '#333',
  },
  replyButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#3A86FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  replyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default Letter;
