import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onToggle, 
  size = 'medium' 
}) => {
  const sizeStyles = {
    small: { width: 24, height: 24, borderRadius: 12 },
    medium: { width: 32, height: 32, borderRadius: 16 },
    large: { width: 40, height: 40, borderRadius: 20 },
  };

  const iconSizes = {
    small: 10,
    medium: 14,
    large: 18,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        isFavorite && styles.activeButton
      ]}
      onPress={onToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.icon, { fontSize: iconSizes[size] }]}>
        {isFavorite ? '❤️' : '🤍'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  activeButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  icon: {
    fontSize: 14,
  },
});