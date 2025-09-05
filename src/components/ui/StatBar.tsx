import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatBarProps {
  label: string;
  value: string;
  color: string;
  showIndicator?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  color, 
  showIndicator = true 
}) => (
  <View style={styles.container}>
    <View style={styles.labelContainer}>
      {showIndicator && (
        <View style={[styles.indicator, { backgroundColor: color }]} />
      )}
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
});