import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

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
    padding: 24,
    justifyContent: 'center',
  },
  headerBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: 60,
    height: 60,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    borderRadius: Theme.borderRadius * 4,
  },
  arrowText: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default IndexScreen;
