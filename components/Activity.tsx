import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ActivityData {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  isRegistrationOpen?: boolean;
  capacity?: number;
  registered?: number;
}

export interface ActivityProps {
  activity: ActivityData;
  onApply?: (activity: ActivityData) => void;
  showApplyButton?: boolean;
  showStatus?: boolean;
}

const Activity = ({ 
  activity, 
  onApply, 
  showApplyButton = true,
  showStatus = true 
}: ActivityProps) => {
  // 计算活动状态（仅在showStatus为true时计算）
  let statusText = '';
  let statusColor = '';
  let canApply = false;
  
  if (showStatus && activity.isRegistrationOpen !== undefined && 
      activity.capacity !== undefined && activity.registered !== undefined) {
    const isFull = activity.registered >= activity.capacity;
    const isActive = activity.isRegistrationOpen;
    
    if (!isActive) {
      statusText = '报名已结束';
      statusColor = '#888';
    } else if (isFull) {
      statusText = '名额已满';
      statusColor = '#FF6B6B';
    } else {
      statusText = '可报名';
      statusColor = '#4CAF50';
      canApply = true;
    }
  }
  
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{activity.title}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>时间：</Text>
        <Text style={styles.infoText}>{activity.date}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>地点：</Text>
        <Text style={styles.infoText}>{activity.location}</Text>
      </View>
      {showStatus && activity.capacity !== undefined && activity.registered !== undefined && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>名额：</Text>
          <Text style={styles.infoText}>{activity.registered}/{activity.capacity}</Text>
        </View>
      )}
      <Text style={styles.description}>{activity.description}</Text>
      
      {(showStatus || showApplyButton) && (
        <View style={styles.cardFooter}>
          {showStatus && (
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          )}
          {showApplyButton && (
            <TouchableOpacity 
              style={[styles.applyButton, (!canApply && showStatus) && styles.applyButtonDisabled]}
              onPress={() => onApply && onApply(activity)}
              disabled={showStatus && !canApply}
            >
              <Text style={styles.applyButtonText}>申请参加</Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 50,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginTop: 10,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#3A86FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  applyButtonDisabled: {
    backgroundColor: '#B8C7E5',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default Activity;
