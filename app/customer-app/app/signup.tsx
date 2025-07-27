import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';
import { Theme } from '../constants/Theme';
import { auth, db } from '../firebaseConfig';

const SignupScreen = () => {
  const router = useRouter();

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
        // Save additional user info to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          phone,
        });
        // Send verification email
        await sendEmailVerification(userCredential.user);
        Alert.alert('Success', 'Account created! Please check your email for verification.');
        // You can navigate or do something here
      })
      .catch((error) => {
        console.log('Signup Error:', error);
        Alert.alert('Signup Error', `${error.message}\nCode: ${error.code}`);
      });
  };

  const handleGoogleSignup = () => {
    Alert.alert('Google Signup', 'Signing up with Google.');
    // Add Google signup logic here
  };

  const handleSignIn = () => {
    // Use Expo Router navigation to go back to login
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Name</Text></View>
      <StyledTextInput
        name="Enter your name"
        value={name}
        onChangeText={setName}
        borderRadius={Theme.borderRadius}
      />
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Email</Text></View>
      <StyledTextInput
        name="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        borderRadius={Theme.borderRadius}
      />
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Phone Number</Text></View>
      <StyledTextInput
        name="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
        borderRadius={Theme.borderRadius}
      />
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Password</Text></View>
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
        style={styles.signupButton}
        textStyle={styles.signupButtonText}
        borderRadius={Theme.borderRadius}
      />
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup} activeOpacity={0.7}>
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signinLink} onPress={handleSignIn} activeOpacity={0.7}>
        <Text style={styles.signinText}>Already have an account? <Text style={styles.signinTextLink}>Sign In</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfc',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a232b',
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
    color: '#1a232b',
  },
  input: {
    backgroundColor: '#e8f0f6',
    borderRadius: 18,
    height: 56,
    fontSize: 20,
    paddingHorizontal: 18,
    marginBottom: 18,
    color: '#1a2b1eff',
  },
  signupButton: {
    backgroundColor: '#4a9a9a',
    borderRadius: 28,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0f6',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 18,
  },
  googleIcon: {
    fontSize: 22,
    marginRight: 12,
    color: '#1a232b',
    fontWeight: '700',
  },
  googleButtonText: {
    fontSize: 20,
    color: '#1a232b',
    fontWeight: '500',
  },
  signinLink: {
    alignItems: 'center',
    marginTop: 32,
  },
  signinText: {
    fontSize: 18,
    color: '#7a98b6',
  },
  signinTextLink: {
    color: '#1790e6',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default SignupScreen;
