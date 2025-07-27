import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
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

const SignupScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          phone,
        });
        await sendEmailVerification(userCredential.user);
        Alert.alert('Success', 'Account created! Please check your email for verification.');
      })
      .catch((error) => {
        console.log('Signup Error:', error);
        Alert.alert('Signup Error', `${error.message}\nCode: ${error.code}`);
      });
  };

  const handleGoogleSignup = () => {
    Alert.alert('Google Signup', 'Signing up with Google.');
  };

  const handleSignIn = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>

        <View style={styles.inputLabelBox}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
        </View>
        <StyledTextInput
          name="Enter your name"
          value={name}
          onChangeText={setName}
          borderRadius={Theme.borderRadius}
        />

        <View style={styles.inputLabelBox}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
        </View>
        <StyledTextInput
          name="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          borderRadius={Theme.borderRadius}
        />

        <View style={styles.inputLabelBox}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number</Text>
        </View>
        <StyledTextInput
          name="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          borderRadius={Theme.borderRadius}
        />

        <View style={styles.inputLabelBox}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
        </View>
        <StyledTextInput
          name="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          borderRadius={Theme.borderRadius}
        />

        <PrimaryButton
          text="Sign Up"
          onPress={handleSignup}
          style={[styles.signupButton, { backgroundColor: colors.tint }]}
          textStyle={[styles.signupButtonText, { color: colors.background }]}
          borderRadius={Theme.borderRadius}
        />

        <TouchableOpacity style={[styles.googleButton, { backgroundColor: colors.card }]} onPress={handleGoogleSignup} activeOpacity={0.7}>
          <Text style={[styles.googleIcon, { color: colors.text }]}>G</Text>
          <Text style={[styles.googleButtonText, { color: colors.text }]}>Sign Up with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signinLink} onPress={handleSignIn} activeOpacity={0.7}>
          <Text style={[styles.signinText, { color: colors.text }]}>
            Already have an account? <Text style={styles.signinTextLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    marginLeft: 8,
  },
  inputLabelBox: {
    marginLeft: 8,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  signupButton: {
    borderRadius: 28,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  signupButtonText: {
    fontSize: 22,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 18,
  },
  googleIcon: {
    fontSize: 22,
    marginRight: 12,
    fontWeight: '700',
  },
  googleButtonText: {
    fontSize: 20,
    fontWeight: '500',
  },
  signinLink: {
    alignItems: 'center',
    marginTop: 32,
  },
  signinText: {
    fontSize: 18,
  },
  signinTextLink: {
    color: '#1790e6',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default SignupScreen;
