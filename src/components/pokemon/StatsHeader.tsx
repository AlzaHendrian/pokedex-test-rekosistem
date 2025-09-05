import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsHeaderProps {
  discoveredCount: number;
  favoritesCount: number;
  isOnline: boolean;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ 
  discoveredCount, 
  favoritesCount, 
  isOnline 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>Gotta catch 'em all!</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{discoveredCount}</Text>
          <Text style={styles.statLabel}>Discovered</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#ef4444' }]}>
            {favoritesCount}
          </Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: isOnline ? '#10b981' : '#ef4444' }
          ]} />
          <Text style={styles.statLabel}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
});