import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Index() {
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;

    // Redirect based on authentication status
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [user, isInitialized]);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
});