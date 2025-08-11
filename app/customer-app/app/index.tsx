import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.tint + '20' }]}>
          <Ionicons name="cube-outline" size={60} color={colors.tint} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>MoveEase</Text>
        <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
          Your trusted moving partner
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="home-outline" size={24} color={colors.tint} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Easy Home Moving
          </Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="people-outline" size={24} color={colors.tint} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Trusted Professionals
          </Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="time-outline" size={24} color={colors.tint} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            24/7 Support
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.tint }]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.tint }]}
          onPress={() => router.push('/signup')}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.tint }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: colors.text + '60' }]}>
        Making moving stress-free since 2024
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  features: {
    marginVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
});
