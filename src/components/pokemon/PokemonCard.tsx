import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Pokemon } from '../../types/pokemon';
import { PokemonImage } from './PokemonImage';
import { FavoriteButton } from './FavoriteButton';
import { pokemonApi } from '../../services/pokemonApi';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  width?: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onPress, 
  isFavorite, 
  onToggleFavorite,
  width = 160
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const imageUrl = pokemonApi.getPokemonImageUrl(pokemon.id);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getGradientColor = (id: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFD93D', '#6C5CE7', '#FD79A8'];
    return colors[id % colors.length] + '10';
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, { width }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <PokemonImage imageUrl={imageUrl} size={80} />
          </View>

          <Text style={styles.pokemonName} numberOfLines={1}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          
          <View style={styles.idContainer}>
            <Text style={styles.pokemonId}>
              #{pokemon.id.toString().padStart(3, '0')}
            </Text>
          </View>
          
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={(e) => {
                e?.stopPropagation?.();
                onToggleFavorite();
              }}
            />
          </View>
        </View>
        
        <View 
          style={[styles.cardGradient, { backgroundColor: getGradientColor(pokemon.id) }]} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  imageContainer: {
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  idContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pokemonId: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});