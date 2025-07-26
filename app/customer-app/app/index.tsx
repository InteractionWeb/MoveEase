import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';
import { auth } from '../firebaseConfig';
import { app, db } from '../firebaseConfig';
import { getApps } from 'firebase/app';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const IndexScreen = () => {
  // Firebase connection test
  React.useEffect(() => {
    console.log('Firebase apps:', getApps());
    getDocs(collection(db, 'users'))
      .then(snapshot => {
        console.log('Firestore users:', snapshot.docs.map(doc => doc.data()));
      })
      .catch(error => {
        console.log('Firestore error:', error);
      });
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Success', 'Logged in successfully!');
        // Navigate to dashboard after login
        const { push } = require('expo-router').useRouter();
        push('/dashboard');
      })
      .catch((error) => {
        Alert.alert('Login Error', error.message);
      });
  };

  const handleSignup = () => {
    Alert.alert('Signup', 'Navigate to signup screen.');
    // Add navigation to signup screen here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>MoveEase</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📧</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="default"
            autoCapitalize="none"
            placeholderTextColor="#4a90a4"
            value={email}
            onChangeText={setEmail}
            editable={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🔒</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
            secureTextEntry={true}
            placeholderTextColor="#4a90a4"
            value={password}
            onChangeText={setPassword}
            editable={true}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          // Use Expo Router navigation for all platforms
          const { push } = require('expo-router').useRouter();
          push('/signup');
        }} activeOpacity={0.7}>
          <Image
            source={require('../assets/images/signup-button.png')}
            style={styles.signupImage}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
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
    color: '#1f4e79',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1f4e79',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4a90a4',
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#d9f0f2',
  },
  iconBox: {
    padding: 12,
  },
  icon: {
    fontSize: 20,
    color: '#4a90a4',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    color: '#1f4e79',
    paddingHorizontal: 8,
    maxWidth: 180,
    alignSelf: 'center',
  },
  loginButton: {
    backgroundColor: '#4a9a9a',
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 24,
    width: 220,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9f0f2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signupImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginVertical: 24,
    alignSelf: 'center',
  },
  signupText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f4e79',
  },
});

export default IndexScreen;
