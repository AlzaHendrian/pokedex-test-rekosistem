import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TypeBadgeProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'medium' }) => {
  const getTypeColor = (typeName: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      normal: { bg: '#A8A878', text: '#2D2D2D' },
      fire: { bg: '#F08030', text: '#FFFFFF' },
      water: { bg: '#6890F0', text: '#FFFFFF' },
      electric: { bg: '#F8D030', text: '#2D2D2D' },
      grass: { bg: '#78C850', text: '#2D2D2D' },
      ice: { bg: '#98D8D8', text: '#2D2D2D' },
      fighting: { bg: '#C03028', text: '#FFFFFF' },
      poison: { bg: '#A040A0', text: '#FFFFFF' },
      ground: { bg: '#E0C068', text: '#2D2D2D' },
      flying: { bg: '#A890F0', text: '#FFFFFF' },
      psychic: { bg: '#F85888', text: '#FFFFFF' },
      bug: { bg: '#A8B820', text: '#2D2D2D' },
      rock: { bg: '#B8A038', text: '#FFFFFF' },
      ghost: { bg: '#705898', text: '#FFFFFF' },
      dragon: { bg: '#7038F8', text: '#FFFFFF' },
      dark: { bg: '#705848', text: '#FFFFFF' },
      steel: { bg: '#B8B8D0', text: '#2D2D2D' },
      fairy: { bg: '#EE99AC', text: '#2D2D2D' },
    };
    return colors[typeName.toLowerCase()] || { bg: '#68A090', text: '#FFFFFF' };
  };

  const typeColor = getTypeColor(type);
  
  const sizeStyles = {
    small: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
    medium: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    large: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  };

  const textSizes = {
    small: 12,
    medium: 14,
    large: 16,
  };

  return (
    <View style={[styles.badge, sizeStyles[size], { backgroundColor: typeColor.bg }]}>
      <Text style={[styles.text, { 
        color: typeColor.text, 
        fontSize: textSizes[size] 
      }]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});