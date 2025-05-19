import { router } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Activity from '../../components/Activity';

// 根据Activity组件中的实际类型定义重写
type ActivityData = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  isRegistrationOpen?: boolean;
  capacity?: number;
  registered?: number;
};

// 假数据
const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: '1',
    title: '城市夜景摄影沙龙',
    date: '2023-12-10 19:00',
    location: '艺术中心',
    description: '一起探讨城市夜景摄影技巧，分享作品，结交志同道合的朋友。',
    isRegistrationOpen: true,
    capacity: 20,
    registered: 12,
  },
  {
    id: '2',
    title: '文学交流会',
    date: '2023-12-15 14:00',
    location: '中央图书馆',
    description: '讨论最近阅读的书籍，交流心得，推荐好书。',
    isRegistrationOpen: true,
    capacity: 15,
    registered: 15, // 已满
  },
  {
    id: '3',
    title: '咖啡品鉴工作坊',
    date: '2023-12-20 10:00',
    location: 'Blue Coffee',
    description: '专业咖啡师带你了解不同产地的咖啡豆，学习品鉴方法。',
    isRegistrationOpen: false, // 已结束
    capacity: 10,
    registered: 8,
  },
];

const ActivityList = () => {
  const [activities] = React.useState(MOCK_ACTIVITIES);

  const handleApply = (activity: ActivityData) => {
    // 导航到申请页面，并传递活动ID
    router.push({
      pathname: '/(tabs)/ApplyActivity',
      params: { activityId: activity.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>活动列表</Text>
      
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Activity 
              activity={item} 
              onApply={handleApply} 
              showApplyButton={true}
              showStatus={true}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无活动</Text>
        </View>
      )}
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
  },
});

export default ActivityList;
