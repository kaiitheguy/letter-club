import Activity from '@/components/Activity';
import TextStyles from '@/constants/TextStyles';
import { getActivities } from '@/lib/supabaseApi';
import { Activity as ActivityType } from '@/lib/types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const ActivityList = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActivities = async () => {
    setIsRefreshing(true);
    const data = await getActivities();
    setActivities(data);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleApply = (activity: ActivityType) => {
    router.push({
      pathname: '/(tabs)/ApplyActivity',
      params: { activityId: activity.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={TextStyles.introText}>在这里，共处不意味着热闹</Text>
      <Text style={TextStyles.title}>安静角落</Text>
      
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Activity 
              activity={{...item, location: ''}} 
              onApply={() => handleApply(item)}
              showApplyButton={true}
            />
          )}
          refreshing={isRefreshing}
          onRefresh={fetchActivities}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isLoading ? "正在安静寻找角落..." : "现在很安静，稍后再来看看吧"}
          </Text>
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
  },
});

export default ActivityList;
