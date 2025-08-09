import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="car" size={normalize(60)} color="white" />
          </View>
          <Text style={styles.appName}>MoveEase</Text>
          <Text style={styles.appSubtitle}>Vendor</Text>
        </View>

        {/* Welcome Content */}
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome, Mover!</Text>
            <Text style={styles.welcomeSubtitle}>
              Join Pakistan's leading moving platform and start earning by helping customers with their relocation needs.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="cash" size={normalize(32)} color="white" />
              <Text style={styles.featureText}>Earn More</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="time" size={normalize(32)} color="white" />
              <Text style={styles.featureText}>Flexible Hours</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={normalize(32)} color="white" />
              <Text style={styles.featureText}>Help Customers</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: 'white' }]}
            onPress={() => router.push('/login')}
          >
            <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
              Login to Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: 'white' }]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.secondaryButtonText}>Join as Vendor</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: normalize(24),
  },
  header: {
    alignItems: 'center',
    paddingTop: normalize(40),
    paddingBottom: normalize(20),
  },
  logoContainer: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(16),
  },
  appName: {
    fontSize: normalize(32),
    fontWeight: '700',
    color: 'white',
    marginBottom: normalize(4),
  },
  appSubtitle: {
    fontSize: normalize(18),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: normalize(40),
  },
  welcomeTitle: {
    fontSize: normalize(28),
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  welcomeSubtitle: {
    fontSize: normalize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: normalize(24),
    paddingHorizontal: normalize(20),
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: normalize(20),
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: 'white',
    marginTop: normalize(8),
  },
  buttonContainer: {
    paddingBottom: normalize(40),
  },
  primaryButton: {
    height: normalize(56),
    borderRadius: normalize(28),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(16),
    ...Theme.shadows.medium,
  },
  primaryButtonText: {
    fontSize: normalize(18),
    fontWeight: '600',
  },
  secondaryButton: {
    height: normalize(56),
    borderRadius: normalize(28),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(24),
  },
  secondaryButtonText: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: 'white',
  },
  footerText: {
    fontSize: normalize(12),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: normalize(40),
  },
});
