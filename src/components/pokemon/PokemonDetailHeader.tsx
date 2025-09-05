import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { PokemonDetail } from '../../types/pokemon';
import { FavoriteButton } from './FavoriteButton';

interface PokemonDetailHeaderProps {
  pokemon: PokemonDetail;
  imageUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  gradientColor: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const PokemonDetailHeader: React.FC<PokemonDetailHeaderProps> = ({
  pokemon,
  imageUrl,
  isFavorite,
  onToggleFavorite,
  gradientColor,
  fadeAnim,
  slideAnim,
  scaleAnim,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          backgroundColor: gradientColor,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="large" color="#64748b" />
          </View>
        )}
        
        <Image
          source={{ uri: imageUrl }}
          style={[styles.pokemonImage, { opacity: imageLoaded ? 1 : 0 }]}
          onLoad={() => setImageLoaded(true)}
        />
        
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            size="large"
          />
        </View>
      </View>

      <Text style={styles.pokemonName}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>
      
      <Text style={styles.pokemonId}>
        #{pokemon.id.toString().padStart(3, '0')}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    marginBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  pokemonImage: {
    width: 180,
    height: 180,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  pokemonId: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
});