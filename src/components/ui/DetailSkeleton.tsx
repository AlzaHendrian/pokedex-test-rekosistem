import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DetailSkeleton: React.FC = () => {
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.skeletonImage, { opacity }]} />
          <Animated.View style={[styles.skeletonTitle, { opacity, marginTop: 16 }]} />
          <Animated.View style={[styles.skeletonSubtitle, { opacity, marginTop: 8 }]} />
        </View>
        
        <View style={styles.section}>
          <Animated.View style={[styles.skeletonSectionTitle, { opacity }]} />
          <View style={styles.badgesContainer}>
            <Animated.View style={[styles.skeletonBadge, { opacity }]} />
            <Animated.View style={[styles.skeletonBadge, { opacity }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#e2e8f0',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
  },
  skeletonImage: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 90,
  },
  skeletonTitle: {
    width: 200,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
  },
  skeletonSubtitle: {
    width: 100,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 9,
  },
  skeletonSectionTitle: {
    width: 120,
    height: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonBadge: {
    width: 80,
    height: 36,
    backgroundColor: '#e2e8f0',
    borderRadius: 18,
  },
});