import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

// Responsive utility
const { width, height } = Dimensions.get('window');
const scale = width / 375; // base scale based on iPhone 11 width

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const IndexScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBox}>
        <Text style={[styles.title, { color: colors.text }]}>MoveEase</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Welcome to the app</Text>
        <PrimaryButton
          text="→"
          onPress={() => router.push('/login')}
          style={[styles.loginButton, { backgroundColor: colors.tint }]}
          textStyle={[styles.arrowText, { color: colors.background }]}
          borderRadius={Theme.borderRadius * 4}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(24),
    justifyContent: 'center',
  },
  headerBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: normalize(32),
    marginBottom: normalize(16),
  },
  title: {
    fontSize: normalize(44),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  subtitle: {
    fontSize: normalize(28),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: normalize(24),
  },
  loginButton: {
    width: normalize(60),
    height: normalize(60),
    marginTop: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    borderRadius: Theme.borderRadius * 4,
  },
  arrowText: {
    fontSize: normalize(28),
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: normalize(28),
  },
});

export default IndexScreen;
