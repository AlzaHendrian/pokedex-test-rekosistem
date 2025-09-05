import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ListFooterProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  isOnline: boolean;
  totalCount: number;
}

export const ListFooter: React.FC<ListFooterProps> = ({ 
  hasMore, 
  isLoadingMore, 
  isOnline, 
  totalCount 
}) => {
  if (!hasMore && !isLoadingMore && totalCount > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.endMessage}>🎉 You've caught them all!</Text>
          <Text style={styles.endSubMessage}>
            You've seen all {totalCount} Pokémon available
          </Text>
        </View>
      </View>
    );
  }

  if (isLoadingMore) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Catching more Pokémon...</Text>
        </View>
      </View>
    );
  }

  if (!isOnline && hasMore) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.offlineIcon}>📡</Text>
          <Text style={styles.offlineMessage}>Connect to internet</Text>
          <Text style={styles.offlineSubMessage}>to catch more Pokémon</Text>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  endMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  endSubMessage: {
    fontSize: 14,
    color: '#64748b',
  },
  offlineIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  offlineMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 4,
  },
  offlineSubMessage: {
    fontSize: 14,
    color: '#64748b',
  },
});