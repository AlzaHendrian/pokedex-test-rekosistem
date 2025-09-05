import React, { useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface PokemonImageProps {
  imageUrl: string;
  size?: number;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({ imageUrl, size = 80 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {!imageLoaded && !imageError && (
        <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
          <ActivityIndicator size="small" color="#64748b" />
        </View>
      )}
      
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { 
          width: size, 
          height: size,
          opacity: imageLoaded ? 1 : 0 
        }]}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
      />
      
      {imageError && (
        <View style={[styles.errorContainer, { borderRadius: size / 2 }]}>
          <Text style={styles.errorText}>?</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 24,
    color: '#64748b',
  },
});