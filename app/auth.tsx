import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Chrome, CircleAlert as AlertCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled in context
      console.log('Login process cancelled or failed');
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>✓</Text>
          </View>
          <Text style={styles.title}>TaskFlow</Text>
          <Text style={styles.subtitle}>
            Your personal task management companion
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
            }}
            style={styles.illustration}
          />
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📝</Text>
            <Text style={styles.featureText}>Create & organize tasks</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⏰</Text>
            <Text style={styles.featureText}>Set due dates & priorities</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle color="#ff6b6b" size={20} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Demo Notice */}
        <View style={styles.demoNotice}>
          <Text style={styles.demoText}>
            Demo Mode: Click below to experience the app with sample data
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#333" size="small" />
          ) : (
            <>
              <Chrome color="#333" size={24} />
              <Text style={styles.loginButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.08,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: width * 0.6,
    height: 140,
    borderRadius: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ff6b6b',
    marginLeft: 8,
    flex: 1,
  },
  demoNotice: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  demoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 12,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});