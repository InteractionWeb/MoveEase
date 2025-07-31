import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Add real auth logic
    router.push('/tabs/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/signup')}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 30,
  },
  input: {
    width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1,
    borderRadius: 8, paddingHorizontal: 16, marginBottom: 16,
  },
  button: {
    backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 30,
    borderRadius: 8, width: '100%', alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontWeight: '600', fontSize: 16,
  },
  link: {
    marginTop: 16, color: 'blue',
  },
});
