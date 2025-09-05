import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface AnimatedSectionProps {
  title: string;
  children: React.ReactNode;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  title,
  children,
  fadeAnim,
  slideAnim,
}) => (
  <Animated.View
    style={[
      styles.section,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <Text style={styles.title}>{title}</Text>
    {children}
  </Animated.View>
);

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
});