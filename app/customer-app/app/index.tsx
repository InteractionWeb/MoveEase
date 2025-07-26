import { useRouter } from 'expo-router';
import { getApps } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import { auth, db } from '../firebaseConfig';

const IndexScreen = () => {
  const router = useRouter();

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
        router.push('/dashboard');
      })
      .catch((error) => {
        Alert.alert('Login Error', error.message);
      });
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

        <PrimaryButton
          text="Log in"
          onPress={handleLogin}
          style={styles.loginButton}
          textStyle={styles.loginButtonText}
        />
        <PrimaryButton
          text="Sign Up"
          onPress={() => router.push('/signup')}
          style={styles.signupButton}
          textStyle={styles.signupText}
        />
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
    backgroundColor: '#d9f0f2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 24,
    width: 220,
    alignSelf: 'center',
  },
  signupText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f4e79',
    textAlign: 'center',
  },
});

export default IndexScreen;
