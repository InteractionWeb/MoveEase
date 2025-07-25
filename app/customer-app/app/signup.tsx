import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const SignupScreen = () => {
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
    const { push } = require('expo-router').useRouter();
    push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Name</Text></View>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#7a98b6"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Email</Text></View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#7a98b6"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Phone Number</Text></View>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        placeholderTextColor="#7a98b6"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <View style={styles.inputLabelBox}><Text style={styles.inputLabel}>Password</Text></View>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#7a98b6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.7}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
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
    color: '#1a232b',
  },
  signupButton: {
    backgroundColor: '#1790e6',
    borderRadius: 28,
    height: 56,
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
