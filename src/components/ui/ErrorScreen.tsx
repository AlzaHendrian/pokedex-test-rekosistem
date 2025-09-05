// components/ui/ErrorScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  emoji?: string;
  onRetry?: () => void;
  retryButtonText?: string;
  showRetryButton?: boolean;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred",
  emoji = "😵",
  onRetry,
  retryButtonText = "Try Again",
  showRetryButton = true,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        {showRetryButton && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>{retryButtonText}</Text>
          </TouchableOpacity>
        )}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Contoh penggunaan dengan variasi error yang berbeda:

// 1. Network Error Screen
export const NetworkErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorScreen
    title="No Internet Connection"
    message="Please check your internet connection and try again"
    emoji="📡"
    onRetry={onRetry}
    retryButtonText="Retry"
  />
);

// 2. Not Found Error Screen
export const NotFoundErrorScreen: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => (
  <ErrorScreen
    title="Pokemon not found"
    message="The Pokemon you're looking for doesn't exist or has been removed"
    emoji="❓"
    onRetry={onGoBack}
    retryButtonText="Go Back"
    showRetryButton={!!onGoBack}
  />
);

// 3. Server Error Screen
export const ServerErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorScreen
    title="Server Error"
    message="Our servers are having trouble. Please try again in a moment"
    emoji="🔧"
    onRetry={onRetry}
    retryButtonText="Try Again"
  />
);

// 4. Loading Timeout Error Screen
export const TimeoutErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorScreen
    title="Request Timeout"
    message="The request is taking too long. Please check your connection and try again"
    emoji="⏰"
    onRetry={onRetry}
    retryButtonText="Retry"
  />
);

// 5. Generic API Error Screen
export const APIErrorScreen: React.FC<{ 
  error?: string;
  onRetry: () => void;
}> = ({ error, onRetry }) => (
  <ErrorScreen
    title="API Error"
    message={error || "Failed to load data from server"}
    emoji="⚠️"
    onRetry={onRetry}
    retryButtonText="Try Again"
  />
);