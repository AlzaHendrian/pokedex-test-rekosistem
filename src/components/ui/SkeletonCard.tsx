import React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Sama dengan PokemonCard

export const SkeletonCard: React.FC = () => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <Animated.View style={[styles.skeletonText, { opacity, marginTop: 12 }]} />
      <Animated.View style={[styles.skeletonTextSmall, { opacity, marginTop: 8 }]} />
    </View>
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
    alignItems: 'center', // Center content
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e2e8f0',
    borderRadius: 40,
    marginBottom: 12,
  },
  skeletonText: {
    width: '80%',
    height: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  skeletonTextSmall: {
    width: '40%',
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
  },
});