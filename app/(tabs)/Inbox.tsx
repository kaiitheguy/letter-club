import Letter from '@/components/Letter';
import TextStyles from '@/constants/TextStyles';
import { getInbox } from '@/lib/supabaseApi';
import { Letter as LetterType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Inbox = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [letters, setLetters] = useState<LetterType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLetters = async () => {
    setIsRefreshing(true);
    const inboxLetters = await getInbox();
    setLetters(inboxLetters);
    setIsRefreshing(false);
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleRefresh = () => {
    fetchLetters();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={TextStyles.introText}>每一封信都是一次遇见</Text>
      <Text style={TextStyles.title}>静听回音</Text>
      
      {isLoaded ? (
        <FlatList
          data={letters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Letter 
              letter={{
                id: item.id,
                title: item.id,
                content: item.body,
                date: item.created_at,
                sender: item.sender_id
              }} 
            />
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>现在很安静，还没有收到来信</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text>正在安静聆听...</Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Inbox;
