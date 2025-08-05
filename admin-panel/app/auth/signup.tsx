import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SignupScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // TODO: Add real signup logic
    alert('Account has been created successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Sign Up</Text>
      
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
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

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
