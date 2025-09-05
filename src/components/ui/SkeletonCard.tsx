import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

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
    <View style={styles.card}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <Animated.View style={[styles.skeletonText, { opacity, marginTop: 12 }]} />
      <Animated.View style={[styles.skeletonTextSmall, { opacity, marginTop: 8 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e2e8f0',
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: 'center',
  },
  skeletonText: {
    width: '80%',
    height: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignSelf: 'center',
  },
  skeletonTextSmall: {
    width: '40%',
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    alignSelf: 'center',
  },
});