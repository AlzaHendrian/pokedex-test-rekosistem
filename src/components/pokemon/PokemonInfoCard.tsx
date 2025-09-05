import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PokemonInfoCardProps {
  title: string;
  content: string;
  borderColor?: string;
}

export const PokemonInfoCard: React.FC<PokemonInfoCardProps> = ({ 
  title, 
  content, 
  borderColor = '#06b6d4' 
}) => (
  <View style={[styles.card, { borderLeftColor: borderColor }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.content}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
});