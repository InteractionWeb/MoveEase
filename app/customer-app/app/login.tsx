import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    Alert.alert('Login', `Logging in with email: ${email}`);
    // Add actual login logic here
  };

  const handleSignup = () => {
    Alert.alert('Signup', 'Navigate to signup screen.');
    // Add navigation to signup screen here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>MoveEase</Text>
      <Text style={styles.subtitle}>Log in</Text>

      <View style={styles.inputContainer}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📧</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#4a90a4"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🔒</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#4a90a4"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Image
          source={require('../assets/images/signup-button.png')}
          style={styles.signupImage}
        />
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 36,
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
  },
  loginButton: {
    backgroundColor: '#4a9a9a',
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 24,
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
    width: 40,
    height: 40,
    marginRight: 12,
  },
  signupText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f4e79',
  },
});

export default LoginScreen;
