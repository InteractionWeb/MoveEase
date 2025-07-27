import { useRouter } from 'expo-router';
import { getApps } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';
import { auth, db } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');
const scaleFont = (size: number) => size * PixelRatio.getFontScale();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  useEffect(() => {
    console.log('🔥 Firebase apps:', getApps());
    getDocs(collection(db, 'users'))
      .then(snapshot => {
        console.log('🧑‍🤝‍🧑 Firestore users:', snapshot.docs.map(doc => doc.data()));
      })
      .catch(error => {
        console.error('❌ Firestore error:', error);
      });
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    console.log('🔐 Attempting login with email:', email);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('✅ Login successful:', userCredential);
        Alert.alert('Success', 'Logged in successfully!');
        router.push('/dashboard');
      })
      .catch((error) => {
        console.error('❌ Login error:', error);
        Alert.alert('Login Error', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>MoveEase</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Log in</Text>

      <View style={styles.inputContainer}>
        <StyledTextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          borderRadius={Theme.borderRadius}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.inputContainer}>
        <StyledTextInput
          placeholder="Password"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          borderRadius={Theme.borderRadius}
          style={{ flex: 1 }}
        />
      </View>

      <PrimaryButton
        text={loading ? 'Logging in...' : 'Log in'}
        onPress={handleLogin}
        style={[styles.loginButton, { backgroundColor: colors.tint }]}
        borderRadius={Theme.borderRadius}
        disabled={loading}
      />

      <TouchableOpacity
        style={[styles.signupButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/signup')}
        activeOpacity={0.8}
      >
        <Image
          source={require('../assets/images/signup-button.png')}
          style={styles.signupImage}
          resizeMode="cover"
        />
        <View style={styles.signupTextWrapper}>
          <Text style={styles.signupText}>Sign up</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFont(48),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  subtitle: {
    fontSize: scaleFont(26),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  loginButton: {
    borderRadius: 24,
    paddingVertical: height * 0.025,
    marginTop: 14,
    marginBottom: 24,
  },
  signupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
    borderRadius: 25,
    overflow: 'hidden',
  },
  signupImage: {
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 25,
  },
  signupTextWrapper: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  signupText: {
    color: '#fff',
    fontSize: scaleFont(24),
    fontWeight: '600',
  },
});

export default LoginScreen;
